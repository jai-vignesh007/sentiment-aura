import { create } from "zustand";

interface UIState {
  connectionState: "idle" | "requesting_mic" | "connecting_ws" | "listening" | "stopped" | "error";
  setConnectionState: (s: UIState["connectionState"]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  connectionState: "idle",
  setConnectionState: (s) => set({ connectionState: s })
}));
