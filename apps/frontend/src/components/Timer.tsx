import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface TimerProps {
  targetTime: number;
  onComplete?: () => void;
  prefix?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const Timer = ({ targetTime, onComplete, prefix }: TimerProps) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(0);
  const onCompleteCalledRef = useRef(false);

  useEffect(() => {
    onCompleteCalledRef.current = false;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft(0);
        if (onComplete && !onCompleteCalledRef.current) {
          onCompleteCalledRef.current = true;
          onComplete();
        }
        return;
      }

      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete]);

  const displayText = prefix
    ? t('round.starts_in', { value: formatTime(timeLeft) })
    : t('round.time_left', { value: formatTime(timeLeft) });

  return <div className="text-xl font-semibold">{displayText}</div>;
};

