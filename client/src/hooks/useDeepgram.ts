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

  // Use refs for immediate state access to avoid async state issues
  const isRunningRef = useRef(false);
  const shouldProcessAudioRef = useRef(false);

  // Zustand store functions for state management
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
    // Prevent multiple simultaneous recording sessions
    if (isRunningRef.current) {
      console.log("Already running, ignoring start");
      return;
    }

    const key = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (!key) {
      setError("Missing Deepgram API key");
      return;
    }

    try {
      // Set flags synchronously before any async operations
      isRunningRef.current = true;
      shouldProcessAudioRef.current = true;
      
      setConn("requesting_mic");
      setRecording(true);

      console.log("Starting microphone...");

      // Request microphone access with optimal audio settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      mediaStreamRef.current = stream;

      // Initialize audio context for processing
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      setConn("connecting_ws");

      // Establish WebSocket connection to Deepgram
      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova&encoding=linear16&sample_rate=16000`,
        ["token", key]
      );

      wsRef.current = ws;

      ws.onopen = () => {
        // Verify we're still supposed to be running after async operations
        if (!isRunningRef.current) {
          ws.close();
          return;
        }
        
        console.log("Deepgram connected - STARTED");
        setConn("listening");
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        cleanup();
        setError("WebSocket connection failed");
        setConn("error");
      };

      ws.onclose = (event) => {
        console.log("Deepgram closed:", event.code, event.reason);
        cleanup();
        setConn("stopped");
      };

      ws.onmessage = (msg) => {
        // Only process messages if recording is still active
        if (!isRunningRef.current) return;
        
        const data = JSON.parse(msg.data);
        if (!data.channel) return;

        const transcript = data.channel.alternatives[0]?.transcript?.trim() || "";
        if (transcript === "") return;

        // Handle partial (interim) transcript
        if (!data.is_final) {
          setPartial(transcript);
          return;
        }

        // Handle final transcript
        setPartial("");
        addFinal(transcript);

        // Throttle sentiment analysis requests
        const now = Date.now();
        if (now - lastSentimentRef.current > 1500) {
          lastSentimentRef.current = now;
          requestSentiment(transcript);
        }
      };

      // Audio processing callback - runs continuously during recording
      processor.onaudioprocess = (event) => {
        // Immediate check to stop audio processing when needed
        if (!shouldProcessAudioRef.current) return;
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        
        const samples = event.inputBuffer.getChannelData(0);
        wsRef.current.send(convert(samples));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

    } catch (err: any) {
      console.error("Start error:", err);
      cleanup();
      setError("Microphone access failed: " + err.message);
      setConn("error");
    }
  };

  // Centralized cleanup function to properly release all resources
  const cleanup = () => {
    console.log("Cleaning up resources...");
    
    // Immediately stop all processing flags
    shouldProcessAudioRef.current = false;
    isRunningRef.current = false;

    // Cleanup WebSocket connection
    try {
      if (wsRef.current) {
        wsRef.current.close(1000, "User stopped");
        wsRef.current = null;
      }
    } catch (err) {
      console.error("Error closing WebSocket:", err);
    }

    // Cleanup audio processing nodes
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

    // Stop all microphone tracks
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          console.log("Stopping track:", track.kind, track.label);
          track.stop();
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
    
    console.log("Cleanup completed");
  };

  const stop = () => {
    console.log("STOP button clicked");
    cleanup();
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

// Convert Float32Array audio data to Int16Array for Deepgram
function convert(buffer: Float32Array) {
  const out = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const v = Math.max(-1, Math.min(1, buffer[i]));
    out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
  }
  return out.buffer;
}