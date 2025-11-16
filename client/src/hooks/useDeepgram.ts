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

  // Zustand setters
  const setPartial = useTranscriptionStore((s) => s.setPartial);
  const addFinal = useTranscriptionStore((s) => s.addFinal);
  const setRecording = useTranscriptionStore((s) => s.setRecording);
  const setError = useTranscriptionStore((s) => s.setError);

  const setConn = useUIStore((s) => s.setConnectionState);

  const setSentiment = useSentimentStore((s) => s.setSentiment);
  const setKeywords = useSentimentStore((s) => s.setKeywords);
  const setSentimentLoading = useSentimentStore((s) => s.setLoading);
  const setSentimentError = useSentimentStore((s) => s.setError);

  const start = async () => {
    const key = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (!key) {
      setError("Missing Deepgram API key");
      return;
    }

    try {
      setConn("requesting_mic");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(512, 1, 1);
      processorRef.current = processor;

      setConn("connecting_ws");

      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova&encoding=linear16&sample_rate=16000`,
        ["token", key]
      );

      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Deepgram connected");
        setConn("listening");
        setRecording(true);
      };

      ws.onerror = (err) => {
        console.error("WS ERROR:", err);
        setError("WebSocket error");
        setConn("error");
      };

      ws.onclose = () => {
        console.log("Deepgram closed");
        setConn("stopped");
        setRecording(false);
      };

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);

        if (!data.channel) return;

        const transcript =
          data.channel.alternatives[0]?.transcript?.trim() || "";

        if (transcript === "") return;

        if (data.is_final) {
          addFinal(transcript);
          requestSentiment(transcript);  
        } else {
          setPartial(transcript);
          requestSentiment(transcript);  
        }
      };

      processor.onaudioprocess = (event) => {
        if (ws.readyState !== 1) return;
        const input = event.inputBuffer.getChannelData(0);
        const int16 = convert(input);
        ws.send(int16);
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
    } catch (err: any) {
      console.error("Start error:", err);
      setError("Mic access failed");
      setConn("error");
    }
  };

  const stop = () => {
    setRecording(false);
    setConn("stopped");

    wsRef.current?.close();
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
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

function convert(buffer: Float32Array) {
  const out = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out.buffer;
}
