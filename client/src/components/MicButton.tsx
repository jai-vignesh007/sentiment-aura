// src/components/MicButton.tsx
// This component renders the large central microphone button.
// It visually reacts to microphone input volume and sentiment values.
// All Deepgram control (start/stop) is passed in from parent to ensure a single shared instance.

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranscriptionStore } from "../store/useTranscriptionStore";
import { useSentimentStore } from "../store/useSentimentStore";
import { useAudioStore } from "../store/useAudioStore";
import { getSentimentColor } from "../util/getSentimentColor";

interface Shockwave {
  id: string;
}

interface MicButtonProps {
  start: () => Promise<void>;
  stop: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ start, stop }) => {
  // Global recording state
  const isRecording = useTranscriptionStore((s) => s.isRecording);

  // Sentiment color is used to drive all mic button animations
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel) ?? "neutral";
  const sentimentScore = useSentimentStore((s) => s.sentimentScore) ?? 0.5;
  const color = getSentimentColor(sentimentLabel, sentimentScore);

  // Volume-driven animation (collected from useAudioStore)
  const volume = useAudioStore((s) => s.volume);

  // Animated shockwave rings for loud moments
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);

  // Trigger shockwave rings when volume crosses threshold
  useEffect(() => {
    if (!isRecording) return;

    if (volume > 0.25) {
      const id = crypto.randomUUID();
      setShockwaves((waves) => [...waves, { id }]);

      // Remove the shockwave once its animation completes
      setTimeout(() => {
        setShockwaves((waves) => waves.filter((w) => w.id !== id));
      }, 1200);
    }
  }, [volume, isRecording]);

  // Toggle mic recording state
  const handleClick = () => {
    if (isRecording) stop();
    else start();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "10vw", 
    height: "10vw",
        zIndex: 30,
      }}
    >
      {/* Shockwave rings generated during loud audio peaks */}
      {shockwaves.map((wave) => (
        <motion.div
          key={wave.id}
          initial={{ opacity: 0.8, scale: 0.3 }}
          animate={{ opacity: 0, scale: 3.5 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `4px solid ${color}`,
            filter: "blur(3px)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Idle pulsing rings shown only while recording */}
      {isRecording &&
        [1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5, scale: 0.4 }}
            animate={{ opacity: 0, scale: 2.7 }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `3px solid ${color}`,
              filter: "blur(4px)",
            }}
          />
        ))}

      {/* Main circular microphone button */}
      <motion.div
        onClick={handleClick}
        animate={{
          scale: isRecording ? 1.15 : 1,
          boxShadow: isRecording
            ? `0 0 50px ${color}, 0 0 90px ${color} inset`
            : `0 0 20px ${color}`,
        }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: `2px solid ${color}`,
          userSelect: "none",
        }}
      >
        {/* Microphone icon with breathing animation while recording */}
        <motion.div
          animate={{ scale: isRecording ? [1, 1.25, 1] : 1 }}
          transition={{
            duration: 1.2,
            repeat: isRecording ? Infinity : 0,
          }}
          style={{
            fontSize: "54px",
            filter: "drop-shadow(0 0 8px white)",
          }}
        >
          🎤
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MicButton;
