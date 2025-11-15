import { create } from "zustand";

interface TranscriptionState {
  partial: string;
  finalText: string;
  isRecording: boolean;
  error: string | null;

  setPartial: (t: string) => void;
  addFinal: (t: string) => void;
  setRecording: (v: boolean) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useTranscriptionStore = create<TranscriptionState>((set) => ({
  partial: "",
  finalText: "",
  isRecording: false,
  error: null,

  setPartial: (t) => set({ partial: t }),

  addFinal: (t) =>
    set((state) => ({
      finalText: state.finalText + " " + t,
      partial: ""
    })),

  setRecording: (v) => set({ isRecording: v }),

  setError: (msg) => set({ error: msg }),

  reset: () => set({ partial: "", finalText: "", error: null })
}));
