// src/hooks/useDeepgram.ts
import { useRef } from "react";
import { useTranscriptionStore } from "../store/useTranscriptionStore";
import { useUIStore } from "../store/useUIStore";
import { analyzeSentiment } from "../api/sentimentApi";
import { useSentimentStore } from "../store/useSentimentStore";

export function useDeepgram() {
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 🚨 CRITICAL FIX: Use refs for immediate state access
  const isRunningRef = useRef(false);
  const shouldProcessAudioRef = useRef(false);

  // Get Zustand store functions
  const setPartial = useTranscriptionStore((s) => s.setPartial);
  const addFinal = useTranscriptionStore((s) => s.addFinal);
  const setRecording = useTranscriptionStore((s) => s.setRecording);
  const setError = useTranscriptionStore((s) => s.setError);

  const setConn = useUIStore((s) => s.setConnectionState);

  const setSentiment = useSentimentStore((s) => s.setSentiment);
  const setKeywords = useSentimentStore((s) => s.setKeywords);
  const setSentimentLoading = useSentimentStore((s) => s.setLoading);
  const setSentimentError = useSentimentStore((s) => s.setError);

  const lastSentimentRef = useRef<number>(0);

  const start = async () => {
    // 🚨 Prevent multiple starts
    if (isRunningRef.current) {
      console.log("⚠️ Already running, ignoring start");
      return;
    }

    const key = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (!key) {
      setError("Missing Deepgram API key");
      return;
    }

    try {
      // 🚨 SET FLAGS FIRST - synchronous
      isRunningRef.current = true;
      shouldProcessAudioRef.current = true;
      
      setConn("requesting_mic");
      setRecording(true); // Set recording state immediately

      console.log("🎤 Starting microphone...");

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      mediaStreamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      setConn("connecting_ws");

      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova&encoding=linear16&sample_rate=16000`,
        ["token", key]
      );

      wsRef.current = ws;

      ws.onopen = () => {
        // 🚨 Double-check we're still supposed to be running
        if (!isRunningRef.current) {
          console.log("🛑 WebSocket opened but we're already stopped, closing...");
          ws.close();
          return;
        }
        
        console.log("✅ Deepgram connected - STARTED");
        setConn("listening");
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        cleanup(); // 🚨 Use cleanup function
        setError("WebSocket connection failed");
        setConn("error");
      };

      ws.onclose = (event) => {
        console.log("🔌 Deepgram closed:", event.code, event.reason);
        cleanup(); // 🚨 Use cleanup function
        setConn("stopped");
      };

      ws.onmessage = (msg) => {
        // 🚨 Check if we should still process messages
        if (!isRunningRef.current) return;
        
        const data = JSON.parse(msg.data);
        if (!data.channel) return;

        const transcript = data.channel.alternatives[0]?.transcript?.trim() || "";
        if (transcript === "") return;

        if (!data.is_final) {
          setPartial(transcript);
          return;
        }

        // FINAL transcript
        setPartial("");
        addFinal(transcript);

        const now = Date.now();
        if (now - lastSentimentRef.current > 1500) {
          lastSentimentRef.current = now;
          requestSentiment(transcript);
        }
      };

      // 🚨 CRITICAL: Audio processing with immediate stop check
      processor.onaudioprocess = (event) => {
        // 🚨 IMMEDIATE check - no async state
        if (!shouldProcessAudioRef.current) return;
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        
        const samples = event.inputBuffer.getChannelData(0);
        wsRef.current.send(convert(samples));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

    } catch (err: any) {
      console.error("❌ Start error:", err);
      cleanup(); // 🚨 Cleanup on error
      setError("Microphone access failed: " + err.message);
      setConn("error");
    }
  };

  // 🚨 NEW: Centralized cleanup function
  const cleanup = () => {
    console.log("🧹 Cleaning up resources...");
    
    // 🚨 IMMEDIATELY stop audio processing
    shouldProcessAudioRef.current = false;
    isRunningRef.current = false;

    // Cleanup WebSocket
    try {
      if (wsRef.current) {
        wsRef.current.close(1000, "User stopped");
        wsRef.current = null;
      }
    } catch (err) {
      console.error("Error closing WebSocket:", err);
    }

    // Cleanup audio processing
    try {
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
      }
    } catch (err) {
      console.error("Error disconnecting processor:", err);
    }

    // Cleanup audio context
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (err) {
      console.error("Error closing audio context:", err);
    }

    // 🚨 CRITICAL: Stop microphone tracks
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          console.log("🛑 Stopping track:", track.kind, track.label);
          track.stop(); // This physically stops the microphone
          track.enabled = false;
        });
        mediaStreamRef.current = null;
      }
    } catch (err) {
      console.error("Error stopping media tracks:", err);
    }

    // Update UI state
    setRecording(false);
    setConn("stopped");
    
    console.log("✅ Cleanup completed");
  };

  const stop = () => {
    console.log("🛑 STOP button clicked");
    cleanup(); // 🚨 Use the centralized cleanup
  };

  const requestSentiment = async (text: string) => {
    try {
      setSentimentLoading(true);
      setSentimentError(null);

      const result = await analyzeSentiment(text);
      setSentiment(result.sentiment_score, result.sentiment_label);
      setKeywords(result.keywords);
    } catch (err) {
      console.error("Sentiment error:", err);
      setSentimentError("Failed to analyze sentiment");
    } finally {
      setSentimentLoading(false);
    }
  };

  return { start, stop };
}

// AUDIO FORMAT
function convert(buffer: Float32Array) {
  const out = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const v = Math.max(-1, Math.min(1, buffer[i]));
    out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
  }
  return out.buffer;
}