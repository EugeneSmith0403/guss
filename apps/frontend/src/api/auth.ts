import { apiClient } from './client';
import type { AuthResponse } from '@guss/shared/api-contracts';

export interface LoginRequest {
  name: string;
  password: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },
};

