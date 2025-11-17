// src/components/Controls.tsx
// Minimal top controls bar containing a Start/Stop toggle and recording indicator.
// This component no longer initializes Deepgram itself.
// The parent (App.tsx) provides start() and stop() so a single Deepgram instance is shared.

import React from "react";
import { useTranscriptionStore } from "../store/useTranscriptionStore";
import { useUIStore } from "../store/useUIStore";

interface ControlsProps {
  start: () => Promise<void>;
  stop: () => void;
}

const Controls: React.FC<ControlsProps> = ({ start, stop }) => {
  // Global recording state
  const isRecording = useTranscriptionStore((s) => s.isRecording);

  // Connection state text shown next to indicator
  const connState = useUIStore((s) => s.connectionState);

  // Toggle microphone session
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
      {/* Start/Stop button controlling the Deepgram session */}
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
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {label}
      </button>

      {/* Small recording indicator circle */}
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: isRecording ? "#ff4f4f" : "#666",
          boxShadow: isRecording ? "0 0 15px rgba(255,80,80,0.7)" : "none",
        }}
      />

      {/* Connection status text */}
      <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>
        {connState}
      </span>
    </div>
  );
};

export default Controls;
