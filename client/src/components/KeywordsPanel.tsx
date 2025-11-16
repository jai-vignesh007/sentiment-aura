// src/components/KeywordsPanel.tsx

import React from "react";
import { useSentimentStore } from "../store/useSentimentStore";
import { getSentimentColor } from "../util/getSentimentColor";

const KeywordsPanel: React.FC = () => {
  const keywords = useSentimentStore((s) => s.keywords);
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel);
  const sentimentScore = useSentimentStore((s) => s.sentimentScore);
  const isLoading = useSentimentStore((s) => s.isLoading);

  const safeLabel = sentimentLabel ?? "neutral";
  const safeScore = sentimentScore ?? 0.5;

  const color = getSentimentColor(safeLabel, safeScore);

  return (
    <div
      style={{
        maxWidth: "300px",
        width: "100%",
        minHeight: "260px",

        padding: "18px 22px",
        borderRadius: "18px",
        background: "rgba(10,10,15,0.75)",
        backdropFilter: "blur(18px)",

        boxShadow: `0 0 25px ${color}`,
        border: `1px solid ${color.replace("0.85", "0.32")}`,

        color: "#f5f5f5",
        fontSize: "1rem",
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
        Sentiment Aura
      </h2>

      {isLoading && (
        <p style={{ opacity: 0.7, marginBottom: 12 }}>Analyzing sentiment…</p>
      )}

      {sentimentScore !== null && (
        <p style={{ marginBottom: 16 }}>
          <strong>Score:</strong> {safeScore.toFixed(2)}
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.15)",
              marginLeft: 10,
              fontSize: "0.85rem",
              opacity: 0.85,
              textTransform: "capitalize",
            }}
          >
            {safeLabel}
          </span>
        </p>
      )}

      {!!keywords.length && (
        <>
          <p style={{ marginBottom: 8, opacity: 0.75 }}>Keywords</p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {keywords.map((k) => (
              <span
                key={k}
                style={{
                  padding: "5px 10px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontSize: "0.85rem",
                }}
              >
                {k}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default KeywordsPanel;
