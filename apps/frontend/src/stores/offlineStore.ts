import { create } from 'zustand';

interface PendingClick {
  roundId: string;
  userId: number;
  timestamp: number;
}

interface OfflineStore {
  pendingClicks: PendingClick[];
  addClick: (roundId: string, userId: number) => void;
  flush: () => void;
  flushForRound: (roundId: string, userId: number) => void;
  getPendingCount: (roundId: string, userId: number) => number;
}

export const useOfflineStore = create<OfflineStore>((set, get) => ({
  pendingClicks: [],
  addClick: (roundId, userId) =>
    set((state) => ({
      pendingClicks: [
        ...state.pendingClicks,
        { roundId, userId, timestamp: Date.now() },
      ],
    })),
  flush: () => set({ pendingClicks: [] }),
  flushForRound: (roundId, userId) =>
    set((state) => ({
      pendingClicks: state.pendingClicks.filter(
        (click) => !(click.roundId === roundId && click.userId === userId),
      ),
    })),
  getPendingCount: (roundId, userId) => {
    const state = get();
    return state.pendingClicks.filter(
      (click) => click.roundId === roundId && click.userId === userId,
    ).length;
  },
}));

