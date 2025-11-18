import { apiClient } from './client';
import type { RoundScoreResponse } from '@guss/shared/api-contracts';

export const scoresApi = {
  increment: async (
    roundId: string,
    userId: number,
  ): Promise<RoundScoreResponse> => {
    return apiClient.patch<RoundScoreResponse>(
      `/scores/rounds/${roundId}/users/${userId}`,
    );
  },

  batchIncrement: async (
    roundId: string,
    userId: number,
    increment: number,
  ): Promise<RoundScoreResponse> => {
    return apiClient.patch<RoundScoreResponse>(
      `/scores/rounds/${roundId}/users/${userId}/batch`,
      { increment },
    );
  },
};

