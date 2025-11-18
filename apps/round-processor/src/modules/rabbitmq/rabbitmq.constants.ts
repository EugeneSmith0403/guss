export const ROUND_COMPLETED_QUEUE = 'round.completed';

export type RoundCompletedMessage = {
  roundId: string;
  endedAt: string;
};

