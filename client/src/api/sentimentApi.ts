import api from "./client";

export type SentimentResponse = {
  sentiment_score: number;
  sentiment_label: "negative" | "neutral" | "positive";
  keywords: string[];
};

export async function analyzeSentiment(text: string): Promise<SentimentResponse> {
  const res = await api.post<SentimentResponse>("/process_text", { text });
  return res.data;
}
