import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { scoresApi } from '../api/scores';
import { useOfflineStore } from '../stores/offlineStore';

export const useOfflineSync = (
  roundId: string | undefined,
  userId: number | undefined,
  isOnline: boolean,
) => {
  const queryClient = useQueryClient();
  const { getPendingCount, flushForRound } = useOfflineStore();

  useEffect(() => {
    if (!isOnline || !roundId || !userId) return;

    const pendingCount = getPendingCount(roundId, userId);
    if (pendingCount === 0) return;

    scoresApi
      .batchIncrement(roundId, userId, pendingCount)
      .then(() => {
        flushForRound(roundId, userId);
        queryClient.invalidateQueries({ queryKey: ['round', roundId] });
      })
      .catch((error) => {
        console.error('Failed to sync offline clicks:', error);
      });
  }, [isOnline, roundId, userId, getPendingCount, flushForRound, queryClient]);
};

