// src/components/FloatingKeywords.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSentimentStore } from "../store/useSentimentStore";
// import { getSentimentColor } from "../util/getSentimentColor";



interface FloatingItem {
  id: string;
  word: string;
}

const FloatingKeywords: React.FC = () => {
  const keywords = useSentimentStore((s) => s.keywords);
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel);
  const sentimentScore = useSentimentStore((s) => s.sentimentScore);

  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  // When keywords array changes, spawn new floating items
  useEffect(() => {
    const newOnes = keywords.map((w) => ({
      id: `${w}-${Math.random().toString(36).slice(2)}`,
      word: w,
    }));
    setFloatingItems(newOnes);
  }, [keywords]);

  // Sentiment → color mapping
  const getColor = () => {
    if (sentimentLabel === "positive") return "rgba(255,215,130,0.9)";
    if (sentimentLabel === "negative") return "rgba(120,160,255,0.9)";
    return "rgba(180,255,230,0.9)";
  };

  // Sentiment → motion modifier
  const energy = 1 + (sentimentScore || 0.5) * 1.4;

  

  return (
    <div
      style={{
        
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 9,
      }}
    >
      {floatingItems.map((item) => {
        const startX = Math.random() * window.innerWidth * 0.8 + 50;
        const drift = (Math.random() - 0.5) * 120 * energy;

        return (
          <motion.div
            key={item.id}
            initial={{
              x: startX,
              y: window.innerHeight - 40,
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              x: startX + drift,
              y: -80, // float to top
              opacity: [0, 1, 1, 0],
              scale: [0.7, 1, 1, 0.9],
            }}
            transition={{
              duration: 4 + Math.random() * 2, // 4–6 seconds
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              color: getColor(),
              fontSize: "1rem",
              fontWeight: 500,
              textShadow: "0 0 10px rgba(255,255,255,0.6)",
            }}
          >
            {item.word}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingKeywords;
