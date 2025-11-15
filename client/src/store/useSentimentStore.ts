import { create } from "zustand";

interface SentimentState {
  sentimentScore: number | null;
  sentimentLabel: string | null;
  keywords: string[];

  setSentiment: (score: number, label: string) => void;
  setKeywords: (words: string[]) => void;
  reset: () => void;
}

export const useSentimentStore = create<SentimentState>((set) => ({
  sentimentScore: null,
  sentimentLabel: null,
  keywords: [],

  setSentiment: (score, label) => set({ sentimentScore: score, sentimentLabel: label }),

  setKeywords: (words) => set({ keywords: words }),

  reset: () => set({ sentimentScore: null, sentimentLabel: null, keywords: [] })
}));
