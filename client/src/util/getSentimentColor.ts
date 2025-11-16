export function getSentimentColor(label: string, score: number) {
  if (label === "positive") {
    return `hsla(48, 95%, ${60 + score * 25}%, 0.85)`;  // gold
  }
  if (label === "negative") {
    return `hsla(220, 90%, ${50 + score * 15}%, 0.85)`; // blue-purple
  }
  return `hsla(180, 70%, ${60 + score * 15}%, 0.85)`;   // teal
}
