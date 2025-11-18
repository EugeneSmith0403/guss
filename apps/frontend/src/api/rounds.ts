import { apiClient } from './client';
import type { Round } from '@guss/shared/types';
import type { CreateRoundResponse } from '@guss/shared/api-contracts';

export const roundsApi = {
  getAll: async (): Promise<Round[]> => {
    return apiClient.get<Round[]>('/rounds');
  },

  getById: async (id: string): Promise<Round | null> => {
    return apiClient.get<Round | null>(`/rounds/${id}`);
  },

  create: async (): Promise<CreateRoundResponse> => {
    return apiClient.post<CreateRoundResponse>('/rounds');
  },
};

