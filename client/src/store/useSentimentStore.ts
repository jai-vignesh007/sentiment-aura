import { create } from "zustand";

interface SentimentState {
  sentimentScore: number | null;
  sentimentLabel: string | null;
  keywords: string[];
  isLoading: boolean;
  error: string | null;

  setSentiment: (score: number, label: string) => void;
  setKeywords: (words: string[]) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useSentimentStore = create<SentimentState>((set) => ({
  sentimentScore: null,
  sentimentLabel: null,
  keywords: [],
  isLoading: false,
  error: null,

  setSentiment: (score, label) =>
    set({ sentimentScore: score, sentimentLabel: label }),

  setKeywords: (words) => set({ keywords: words }),

  setLoading: (v) => set({ isLoading: v }),

  setError: (msg) => set({ error: msg }),

  reset: () =>
    set({
      sentimentScore: null,
      sentimentLabel: null,
      keywords: [],
      isLoading: false,
      error: null,
    }),
}));
