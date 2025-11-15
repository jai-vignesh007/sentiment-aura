import { useRef } from "react";
import { useTranscriptionStore } from "../store/useTranscriptionStore";
import { useUIStore } from "../store/useUIStore";

export function useDeepgram() {
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const setPartial = useTranscriptionStore((s) => s.setPartial);
  const addFinal = useTranscriptionStore((s) => s.addFinal);
  const setRecording = useTranscriptionStore((s) => s.setRecording);
  const setError = useTranscriptionStore((s) => s.setError);

  const setConnState = useUIStore((s) => s.setConnectionState);

  const start = async () => {
    const key = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (!key) {
      setError("Missing Deepgram API key");
      return;
    }

    try {
      setConnState("requesting_mic");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(1024, 1, 1);

      processorRef.current = processor;

      setConnState("connecting_ws");

      const ws = new WebSocket("wss://api.deepgram.com/v1/listen?model=nova", {
        headers: {
          Authorization: `Token ${key}`
        }
      } as any);

      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Deepgram connected");
        setConnState("listening");
        setRecording(true);
      };

      ws.onerror = (err) => {
        console.error("WS Error", err);
        setError("WebSocket error");
        setConnState("error");
      };

      ws.onclose = () => {
        console.log("Deepgram closed");
        setConnState("stopped");
        setRecording(false);
      };

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);

        if (!data.channel) return;

        const transcript =
          data.channel.alternatives[0]?.transcript?.trim() || "";

        if (transcript === "") return;

        if (data.is_final) {
          addFinal(transcript);
        } else {
          setPartial(transcript);
        }
      };

      processor.onaudioprocess = (event) => {
        if (ws.readyState !== 1) return;

        const input = event.inputBuffer.getChannelData(0);
        const int16 = convertFloat32ToInt16(input);
        ws.send(int16);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
    } catch (err: any) {
      setError("Mic access failed");
      setConnState("error");
    }
  };

  const stop = () => {
    setRecording(false);
    setConnState("stopped");

    wsRef.current?.close();

    processorRef.current?.disconnect();
    audioContextRef.current?.close();

    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
  };

  return { start, stop };
}

// HELPER
function convertFloat32ToInt16(buffer: Float32Array) {
  const l = buffer.length;
  const out = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    let s = buffer[i];
    s = Math.max(-1, Math.min(1, s));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out.buffer;
}
