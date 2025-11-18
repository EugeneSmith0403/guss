import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Round } from '@guss/shared/types';
import { Card, CardContent, Typography } from '@mui/material';

interface RoundCardProps {
  round: Round;
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const RoundCard = ({ round }: RoundCardProps) => {
  const { t } = useTranslation();

  return (
    <Link to={`/rounds/${round.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          margin: 2,
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'translateY(-1px)',
          },
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', wordBreak: 'break-all' }}>
            Round ID: {round.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {t('rounds.start')}: {formatDate(round.start)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {t('rounds.end')}: {formatDate(round.end)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('rounds.status_label')}: {t(`rounds.status.${round.status}`)}
          </Typography>
          {round.totalScore > 0 && (
            <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 500 }}>
              Total Score: {round.totalScore}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

