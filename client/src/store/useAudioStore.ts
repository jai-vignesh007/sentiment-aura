import { create } from "zustand";

interface AudioState {
  volume: number;
  setVolume: (v: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  volume: 0,
  setVolume: (v) => set({ volume: v }),
}));
