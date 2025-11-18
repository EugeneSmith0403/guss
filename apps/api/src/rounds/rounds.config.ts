import { COOLDOWN_DURATION, ROUND_DURATION } from '@shared/config';

export const getRoundDurations = () => ({
  duration: ROUND_DURATION,
  cooldown: COOLDOWN_DURATION,
});

export type RoundDurations = ReturnType<typeof getRoundDurations>;
