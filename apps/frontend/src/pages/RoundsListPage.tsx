import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Alert, Typography, Box, Pagination } from '@mui/material';
import { roundsApi } from '../api/rounds';
import { RoundCard } from '../components/RoundCard';
import { Header } from '../components/Header';

const ROUNDS_PER_PAGE = 10;

export const RoundsListPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data: rounds, isLoading, error } = useQuery({
    queryKey: ['rounds'],
    queryFn: roundsApi.getAll,
    refetchInterval: 5000,
  });

  const totalPages = useMemo(
    () => (rounds ? Math.ceil(rounds.length / ROUNDS_PER_PAGE) : 0),
    [rounds],
  );

  const paginatedRounds = useMemo(() => {
    if (!rounds) return [];
    const startIndex = (page - 1) * ROUNDS_PER_PAGE;
    const endIndex = startIndex + ROUNDS_PER_PAGE;
    return rounds.slice(startIndex, endIndex);
  }, [rounds, page]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(1);
    }
  }, [totalPages, page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <Header />
        <div className="max-w-4xl mx-auto mt-8">
          <Alert severity="error">{t('errors.network_error')}</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 3, mx: 2 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 600 }}>
            {t('rounds.title')}
          </Typography>
        </Box>

        <div className="space-y-4">
          {paginatedRounds && paginatedRounds.length > 0 ? (
            paginatedRounds.map((round) => <RoundCard key={round.id} round={round} />)
          ) : (
            <div className="text-center py-8">
              <Typography variant="body1" color="text.secondary">
                {t('rounds.no_rounds', { defaultValue: 'No rounds yet' })}
              </Typography>
            </div>
          )}
        </div>

        {rounds && rounds.length > ROUNDS_PER_PAGE && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </div>
    </div>
  );
};

