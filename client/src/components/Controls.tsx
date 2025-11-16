import React, { useEffect, useState, useRef } from "react";
import { useTranscriptionStore } from "../store/useTranscriptionStore";
import { useUIStore } from "../store/useUIStore";
import { useDeepgram } from "../hooks/useDeepgram";

const Controls: React.FC = () => {
  const { start, stop } = useDeepgram();
  const isRecording = useTranscriptionStore((s) => s.isRecording);
  const connState = useUIStore((s) => s.connectionState);

  const [volume, setVolume] = useState(0);
  const audioRef = useRef<AnalyserNode | null>(null);

  // Start mic volume visualization
  useEffect(() => {
    let raf: number;

    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        audioRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setVolume(avg / 255);
          raf = requestAnimationFrame(tick);
        };
        tick();
      });
    }

    return () => cancelAnimationFrame(raf);
  }, [isRecording]);

  const handleClick = () => {
    if (isRecording) stop();
    else start();
  };

  const label = isRecording ? "Stop" : "Start";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 25,
        marginBottom: 18,
      }}
    >
      {/* Start/Stop Button */}
      <button
        onClick={handleClick}
        style={{
          padding: "12px 28px",
          borderRadius: "14px",
          background: isRecording
            ? "linear-gradient(135deg, rgba(255,80,80,0.25), rgba(255,80,80,0.15))"
            : "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          backdropFilter: "blur(20px)",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "1rem",
          transition: "all 0.25s ease",
          boxShadow: isRecording
            ? "0 0 25px rgba(255,50,50,0.35)"
            : "0 0 20px rgba(255,255,255,0.08)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {label}
      </button>

      {/* Mic Visualizer */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          //   width: 14,
          height: 14,
          borderRadius: "50%",
          background: isRecording ? "#ff4f4f" : "#666",
          transform: `scale(${1 + volume * 1.2})`,
          transition: "transform 0.05s linear",
          boxShadow: isRecording
            ? `0 0 ${8 + volume * 20}px rgba(255,80,80,0.7)`
            : "none",
        }}
      />

      {/* Connection Status */}
      <span style={{ fontSize: "0.85rem", opacity: 0.75, marginLeft: 6 }}>
        {connState}
      </span>
    </div>
  );
};

export default Controls;
