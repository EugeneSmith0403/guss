import { useEffect, useRef } from 'react';
import type { Round } from '@guss/shared/types';
import { useRoundStatus } from './useRoundStatus';

export const useRoundStatusMonitor = (
  round: Round | null | undefined,
  onStatusChange?: (status: 'cooldown' | 'active' | 'complete') => void,
) => {
  const currentStatus = useRoundStatus(round);
  const previousStatusRef = useRef(currentStatus);

  useEffect(() => {
    if (!round) return;

    const checkStatus = () => {
      const now = Math.floor(Date.now() / 1000);
      let status: 'cooldown' | 'active' | 'complete' = 'cooldown';
      
      if (now < round.start) {
        status = 'cooldown';
      } else if (now >= round.end) {
        status = 'complete';
      } else {
        status = 'active';
      }
      
      const previousStatus = previousStatusRef.current;
      
      if (
        (previousStatus === 'cooldown' && status === 'active') ||
        (previousStatus === 'active' && status === 'complete')
      ) {
        onStatusChange?.(status);
      }
      
      previousStatusRef.current = status;
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, [round, onStatusChange]);
};

