import { Typography, Alert, Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Timer } from './Timer';
import type { Round } from '@guss/shared/types';
import type { RoundStatus } from '../hooks/useRoundStatus';

interface RoundStatusContentProps {
  status: RoundStatus;
  round: Round;
  displayScore: number;
  isOnline: boolean;
  onTimerComplete: () => void;
  isAdmin?: boolean;
}

export const RoundStatusContent = ({
  status,
  round,
  displayScore,
  isOnline,
  onTimerComplete,
  isAdmin = false,
}: RoundStatusContentProps) => {
  const { t } = useTranslation();

  if (status === 'cooldown') {
    return (
      <>
        <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
          {t('round.cooldown')}
        </Typography>
        <Timer targetTime={round.start} prefix="starts" onComplete={onTimerComplete} />
      </>
    );
  }

  if (status === 'active') {
    return (
      <>
        <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
          {t('round.active')}
        </Typography>
        <Timer targetTime={round.end} onComplete={onTimerComplete} />
        {!isAdmin && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('round.my_score', { value: displayScore })}
          </Typography>
        )}
        {!isOnline && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Offline mode - clicks will be synced when online
          </Alert>
        )}
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
        {t('round.complete')}
      </Typography>
      {round.winner ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          <Typography variant="body1">
            {t('round.total_score')}: {round.totalScore}
          </Typography>
          <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            {t('round.winner')}: {round.winner.name} - {round.winner.score}
          </Typography>
          {!isAdmin && (
            <Typography variant="body1">
              {t('round.my_score', { value: displayScore })}
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 4, gap: 2 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('common.loading')}...
          </Typography>
        </Box>
      )}
    </>
  );
};

