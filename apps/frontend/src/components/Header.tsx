import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/userStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button, Typography } from '@mui/material';
import { authApi } from '../api/auth';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { roundsApi } from '../api/rounds';

export const Header = () => {
  const { t } = useTranslation();
  const { user, logout: logoutStore } = useUserStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.name === 'admin';
  const isRoundPage = location.pathname.startsWith('/rounds/') && location.pathname !== '/rounds';

  const createRoundMutation = useMutation({
    mutationFn: roundsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      navigate(`/rounds/${data.id}`);
    },
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logoutStore();
      queryClient.clear();
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <header className="flex justify-between items-center p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {isRoundPage && (
          <Button
            variant="outlined"
            onClick={() => navigate('/rounds')}
            size="small"
          >
            {t('common.back')}
          </Button>
        )}
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => createRoundMutation.mutate()}
            disabled={createRoundMutation.isPending}
            size="small"
            sx={{ px: 'calc(16px + 2px)' }}
          >
            {createRoundMutation.isPending ? t('common.loading') : t('rounds.create')}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Typography variant="body1">{user.name}</Typography>
        <Button variant="outlined" onClick={handleLogout}>
          {t('common.logout')}
        </Button>
      </div>
    </header>
  );
};

