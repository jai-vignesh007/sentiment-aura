import { useTranscriptionStore } from "./store/useTranscriptionStore";
import { useUIStore } from "./store/useUIStore";

function App() {
  const partial = useTranscriptionStore((s) => s.partial);
  const finalText = useTranscriptionStore((s) => s.finalText);
  const connectionState = useUIStore((s) => s.connectionState);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Sentiment Aura – Dev Scaffold</h1>

      <p>Connection State: {connectionState}</p>

      <h2>Final Transcript</h2>
      <p>{finalText}</p>

      <h2>Partial Transcript</h2>
      <p style={{ color: "gray" }}>{partial}</p>
    </div>
  );
}

export default App;
