// src/components/KeywordsPanel.tsx
import React from "react";
import { useSentimentStore } from "../store/useSentimentStore";
import { getSentimentColor } from "../util/getSentimentColor";

const KeywordsPanel: React.FC = () => {
  const keywords = useSentimentStore((s) => s.keywords);
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel) ?? "neutral";
  const sentimentScore = useSentimentStore((s) => s.sentimentScore) ?? 0.5;
  const isLoading = useSentimentStore((s) => s.isLoading);

  const color = getSentimentColor(sentimentLabel, sentimentScore);

  return (
    <div
      style={{
        flex: "1 1 400px",       // ⬅ same width as transcript
        maxWidth: "450px",       // ⬅ same ceiling width
        minHeight: "160px",
        maxHeight: "35vh",

        padding: "16px 20px",
        borderRadius: "16px",
        background: "rgba(10,10,15,0.75)",
        backdropFilter: "blur(16px)",

        boxShadow: `0 0 22px ${color}`,
        border: `1px solid ${color.replace("0.85", "0.32")}`,
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Sentiment Aura</h2>

      {isLoading && <p>Analyzing…</p>}

      <p style={{ marginBottom: 10 }}>
        <strong>Score:</strong> {sentimentScore.toFixed(2)}
        <span
          style={{
            marginLeft: 8,
            padding: "3px 8px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.2)",
            textTransform: "capitalize",
            fontSize: "0.8rem",
          }}
        >
          {sentimentLabel}
        </span>
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {keywords.map((k) => (
          <span
            key={k}
            style={{
              padding: "4px 8px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              fontSize: "0.75rem",
            }}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordsPanel;
