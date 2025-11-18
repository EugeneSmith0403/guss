import type { User, RoundScoreResponse } from './types.js';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateRoundResponse {
  id: string;
}

export type { RoundScoreResponse };

