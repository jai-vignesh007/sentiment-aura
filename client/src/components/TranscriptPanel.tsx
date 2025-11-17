// src/components/TranscriptPanel.tsx
import React, { useRef, useEffect } from "react";
import { useTranscriptionStore } from "../store/useTranscriptionStore";
import { getSentimentColor } from "../util/getSentimentColor";
import { useSentimentStore } from "../store/useSentimentStore";

const TranscriptPanel: React.FC = () => {
  const finalText = useTranscriptionStore((s) => s.finalText);
  const partial = useTranscriptionStore((s) => s.partial);

  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel) ?? "neutral";
  const sentimentScore = useSentimentStore((s) => s.sentimentScore) ?? 0.5;
  const color = getSentimentColor(sentimentLabel, sentimentScore);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [finalText, partial]);

  return (
    <div
      ref={ref}
      style={{
        flex: "1 1 400px",      // ⬅ equal width rule
        maxWidth: "450px",      // ⬅ both panels same max width
        minHeight: "160px",
        maxHeight: "35vh",

        padding: "16px 20px",
        borderRadius: "16px",
        background: "rgba(5,5,10,0.55)",
        backdropFilter: "blur(16px)",

        boxShadow: `0 0 22px ${color}`,
        border: `1px solid ${color.replace("0.85", "0.32")}`,
        overflowY: "auto",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Transcript</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{finalText}</p>
      {partial && (
        <p style={{ opacity: 0.6, fontStyle: "italic" }}>
          {partial} <span>▌</span>
        </p>
      )}
    </div>
  );
};

export default TranscriptPanel;
