import { create } from 'zustand';

interface RoundStore {
  localScore: number;
  setLocalScore: (score: number) => void;
  incrementLocalScore: () => void;
  resetLocalScore: () => void;
}

export const useRoundStore = create<RoundStore>((set) => ({
  localScore: 0,
  setLocalScore: (score) => set({ localScore: score }),
  incrementLocalScore: () => set((state) => ({ localScore: state.localScore + 1 })),
  resetLocalScore: () => set({ localScore: 0 }),
}));

