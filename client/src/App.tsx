// src/App.tsx

import AuraCanvas from "./components/AuraCanvas";
import TranscriptPanel from "./components/TranscriptPanel";
import KeywordsPanel from "./components/KeywordsPanel";
import Controls from "./components/Controls";
import FloatingKeywords from "./components/FloatingKeywords";
import DustParticles from "./components/DustParticles";
import { motion } from "framer-motion";
import { useSentimentStore } from "./store/useSentimentStore";

function App() {
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel);

  return (
    <motion.div
      key={sentimentLabel}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        style={{
          minHeight: "100vh",
          color: "#f5f5f5",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Background layers */}
        <AuraCanvas />
        <FloatingKeywords />
        <DustParticles />

        {/* Depth overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* ================================
            MAIN CENTERED UI WRAPPER
           ================================ */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            padding: "40px 24px",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            overflowY: "auto",
          }}
        >
          {/* Inner content container */}
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,              // more breathing room
              paddingBottom: "80px" // avoids cutting off bottom of content
            }}
          >
            {/* Header */}
            <header
              style={{
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "2.4rem",
                  letterSpacing: "0.04em",
                  textShadow: "0 0px 14px rgba(0,0,0,0.65)",
                }}
              >
                Sentiment Aura
              </h1>

              <p
                style={{
                  marginTop: 6,
                  opacity: 0.8,
                  maxWidth: 600,
                  fontSize: "0.9rem",
                }}
              >
                Speak into the microphone and watch your emotional tone paint
                the space around you in real time.
              </p>
            </header>

            {/* Controls centered */}
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Controls />
            </div>

            {/* Panels row */}
            <main
              style={{
                display: "flex",
                gap: 32,                // increased spacing
                justifyContent: "center",
                alignItems: "flex-start",
                flexWrap: "wrap",
                marginTop: "20px",       // pushes panels further down
                width: "100%",
              }}
            >
              {/* <TranscriptPanel />
              <KeywordsPanel /> */}
            </main>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
