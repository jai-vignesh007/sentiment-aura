// src/components/TranscriptPanel.tsx

import React, { useRef, useEffect } from "react";
import { useTranscriptionStore } from "../store/useTranscriptionStore";
import { getSentimentColor } from "../util/getSentimentColor";
import { useSentimentStore } from "../store/useSentimentStore";

const TranscriptPanel: React.FC = () => {
  const finalText = useTranscriptionStore((s) => s.finalText);
  const partial = useTranscriptionStore((s) => s.partial);

  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel);
  const sentimentScore = useSentimentStore((s) => s.sentimentScore ?? 0.5);

  const safeLabel = sentimentLabel ?? "neutral";
  const safeScore = sentimentScore ?? 0.5;
  const color = getSentimentColor(safeLabel, safeScore);

  const ref = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new text
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [finalText, partial]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: "600px",
        minHeight: "260px",
        padding: "18px 22px",
        borderRadius: "18px",
        background: "rgba(5, 5, 10, 0.55)",
        backdropFilter: "blur(18px)",

        boxShadow: `0 0 25px ${color}`,
        border: `1px solid ${color.replace("0.85", "0.32")}`,

        color: "#f5f5f5",
        fontSize: "1rem",
        lineHeight: 1.55,
        overflowY: "auto",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 14,
          fontSize: "1.25rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        Transcript
      </h2>

      <p style={{ whiteSpace: "pre-wrap", marginBottom: 6 }}>{finalText}</p>

      {partial && (
        <p style={{ opacity: 0.6, fontStyle: "italic" }}>
          {partial} <span style={{ opacity: 0.9 }}>▌</span>
        </p>
      )}
    </div>
  );
};

export default TranscriptPanel;
