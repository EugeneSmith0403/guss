import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Card, CardContent, CircularProgress, Alert, Box } from '@mui/material';
import type { Round } from '@guss/shared/types';
import { roundsApi } from '../api/rounds';
import { scoresApi } from '../api/scores';
import { useUserStore } from '../stores/userStore';
import { useRoundStore } from '../stores/roundStore';
import { useOfflineStore } from '../stores/offlineStore';
import { GooseImage } from '../components/GooseImage';
import { ExplodedGooseImage } from '../components/ExplodedGooseImage';
import { Header } from '../components/Header';
import { RoundStatusContent } from '../components/RoundStatusContent';
import { useRoundStatus } from '../hooks/useRoundStatus';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useRoundStatusMonitor } from '../hooks/useRoundStatusMonitor';

export const RoundPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { incrementLocalScore, resetLocalScore } = useRoundStore();
  const { addClick } = useOfflineStore();
  const isOnline = useOnlineStatus();
  const isAdmin = user?.name === 'admin';

  const { data: round, isLoading, refetch } = useQuery({
    queryKey: ['round', id],
    queryFn: () => roundsApi.getById(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const round = query.state.data as Round | null | undefined;
      if (!round) return false;

      const now = Math.floor(Date.now() / 1000);
      const isComplete = now >= round.end;
      const isWinnerPending = typeof round.winnerId === 'undefined';

      if (isComplete && isWinnerPending) {
        return 2000;
      }

      return false;
    },
  });

  const currentStatus = useRoundStatus(round);

  useRoundStatusMonitor(round, (status) => {
    refetch();
    if (status === 'complete') {
      resetLocalScore();
    }
  });

  useOfflineSync(id, user?.id, isOnline);

  const scoreMutation = useMutation({
    mutationFn: () => scoresApi.increment(id!, user!.id),
    onSuccess: (data) => {
      queryClient.setQueryData(['round', id], (old: Round | null | undefined) => {
        if (!old) return old;
        return {
          ...old,
          totalScore: data.score,
          userRound: old.userRound
            ? { ...old.userRound, score: data.score }
            : {
                score: data.score,
                roundId: old.id,
                userId: user!.id,
                userName: user!.name,
              },
        };
      });
    },
    onError: () => {
      if (!isOnline && id && user) {
        addClick(id, user.id);
      }
    },
  });

  const handleGooseClick = useCallback(() => {
    if (!round || !user || currentStatus !== 'active' || isAdmin) return;

    incrementLocalScore();

    if (isOnline) {
      scoreMutation.mutate();
    } else {
      addClick(id!, user.id);
    }
  }, [round, user, currentStatus, isOnline, isAdmin, id, incrementLocalScore, scoreMutation, addClick]);

  const displayScore = round?.userRound?.score ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!round) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto p-4">
          <Alert severity="error">Round not found</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                mb: 3,
              }}
            >
              {currentStatus === 'complete' ? (
                <ExplodedGooseImage />
              ) : (
                <GooseImage
                  onClick={handleGooseClick}
                  disabled={currentStatus !== 'active' || isAdmin}
                />
              )}
            </Box>

            <RoundStatusContent
              status={currentStatus}
              round={round}
              displayScore={displayScore}
              isOnline={isOnline}
              onTimerComplete={refetch}
              isAdmin={isAdmin}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

