import { useMemo } from 'react';
import type { Round } from '@guss/shared/types';

export type RoundStatus = 'cooldown' | 'active' | 'complete';

export const useRoundStatus = (round: Round | null | undefined): RoundStatus => {
  return useMemo(() => {
    if (!round) return 'cooldown';
    
    const now = Math.floor(Date.now() / 1000);
    if (now < round.start) return 'cooldown';
    if (now >= round.end) return 'complete';
    return 'active';
  }, [round]);
};

