// src/App.tsx
// Root application component.
// Orchestrates global audio, visualization layers, sentiment-driven UI, and layout structure.
// The Deepgram hook is intentionally created ONLY here to ensure a single shared instance.

import AuraCanvas from "./components/AuraCanvas";
import TranscriptPanel from "./components/TranscriptPanel";
import KeywordsPanel from "./components/KeywordsPanel";
import Controls from "./components/Controls";
import FloatingKeywords from "./components/FloatingKeywords";
import DustParticles from "./components/DustParticles";
import MicButton from "./components/MicButton";
import { motion } from "framer-motion";
import { useSentimentStore } from "./store/useSentimentStore";
import { useDeepgram } from "./hooks/useDeepgram"; // Creates single Deepgram session

function App() {
  // Initialize Deepgram once for the entire application.
  // start() and stop() are passed down to UI components.
  const { start, stop } = useDeepgram();

  // Trigger subtle crossfade animation on sentiment changes
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel);

  return (
    <motion.div
      key={sentimentLabel}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "relative",
          color: "#f5f5f5",
          overflow: "hidden",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Background visual layers */}
        <AuraCanvas />
        {/* <FluidCanvas /> — alternative visualization */}
        <FloatingKeywords />
        <DustParticles />

        {/* Darkening overlay for text readability */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Top header and controls */}
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 0,
            right: 0,
            zIndex: 10,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            pointerEvents: "none",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              textShadow: "0 0 14px rgba(0,0,0,0.55)",
            }}
          >
            Sentiment Aura
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              opacity: 0.75,
              maxWidth: 500,
            }}
          >
            Speak into the microphone and watch your emotional tone shape the
            aura around you.
          </p>

          {/* Controls bar (start/stop/indicator) */}
          <div style={{ pointerEvents: "auto" }}>
            <Controls start={start} stop={stop} />
          </div>
        </div>

        {/* Central microphone interaction button */}
        <MicButton start={start} stop={stop} />

        {/* Bottom transcript + sentiment panel */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
            gap: 24,
            padding: "0 20px",
            flexWrap: "wrap",
          }}
        >
          <TranscriptPanel />
          <KeywordsPanel />
        </div>
      </div>
    </motion.div>
  );
}

export default App;
