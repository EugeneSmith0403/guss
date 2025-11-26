export interface User {
  id: number;
  name: string;
}

export interface Round {
  id: string;
  start: number;
  end: number;
  status: 'active' | 'cooldown' | 'complete';
  totalScore: number;
  winnerId?: number | null;
  winner: {
    id?: number;
    name?: string;
    score?: number;
  };
  userRound?: {
    score: number;
    roundId: string;
    userId: number;
    userName: string;
  };
}

export interface RoundScoreResponse {
  score: number;
}

