import { useTranscriptionStore } from "./store/useTranscriptionStore";
import { useUIStore } from "./store/useUIStore";
import { useSentimentStore } from "./store/useSentimentStore";
import { useDeepgram } from "./hooks/useDeepgram";

function App() {
  const { start, stop } = useDeepgram();

  const partial = useTranscriptionStore((s) => s.partial);
  const finalText = useTranscriptionStore((s) => s.finalText);
  const isRecording = useTranscriptionStore((s) => s.isRecording);
  const error = useTranscriptionStore((s) => s.error);
  const connState = useUIStore((s) => s.connectionState);

  const sentimentScore = useSentimentStore((s) => s.sentimentScore);
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel);
  const keywords = useSentimentStore((s) => s.keywords);
  const sentimentLoading = useSentimentStore((s) => s.isLoading);
  const sentimentError = useSentimentStore((s) => s.error);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Sentiment Aura – Dev View</h1>

      <p>Connection: {connState}</p>
      {error && <p style={{ color: "red" }}>Transcription error: {error}</p>}

      {!isRecording ? (
        <button onClick={start}>Start</button>
      ) : (
        <button onClick={stop}>Stop</button>
      )}

      <h2>Final Transcript</h2>
      <p>{finalText}</p>

      <h2>Partial Transcript</h2>
      <p style={{ color: "gray" }}>{partial}</p>

      <h2>Sentiment</h2>
      {sentimentLoading && <p>Analyzing sentiment...</p>}
      {sentimentError && <p style={{ color: "red" }}>{sentimentError}</p>}
      {sentimentScore !== null && (
        <p>
          Score: {sentimentScore.toFixed(2)} | Label: {sentimentLabel}
        </p>
      )}

      <h3>Keywords</h3>
      <ul>
        {keywords.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
