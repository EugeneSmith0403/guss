import { RoundStatus } from '@prisma/client';

export const getCurrentUnixTimeSeconds = () => Math.floor(Date.now() / 1000);

export const calculateRoundStatus = (
  persistedStatus: RoundStatus,
  start: number,
  end: number,
  now: number,
): RoundStatus => {
  if (persistedStatus === RoundStatus.complete || now >= end) {
    return RoundStatus.complete;
  }
  if (now >= start && now < end) {
    return RoundStatus.active;
  }
  return RoundStatus.cooldown;
};
