import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, Alert } from '@mui/material';
import { authApi } from '../api/auth';
import { useUserStore } from '../stores/userStore';

const loginSchema = z.object({
  name: z.string().min(1, 'required'),
  password: z.string().min(1, 'required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUserAndToken } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUserAndToken(data.user, data.token);
      navigate('/rounds');
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card sx={{ width: '100%', maxWidth: 500 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: 'primary.main' }}>
            {t('login.title')}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextField
              {...register('name')}
              label={t('login.username')}
              fullWidth
              error={!!errors.name}
              helperText={errors.name ? t('login.required') : ''}
            />

            <TextField
              {...register('password')}
              type="password"
              label={t('login.password')}
              fullWidth
              error={!!errors.password}
              helperText={errors.password ? t('login.required') : ''}
            />

            {loginMutation.isError && (
              <Alert severity="error">
                {t('errors.invalid_credentials')}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loginMutation.isPending}
              sx={{ mt: 1 }}
            >
              {loginMutation.isPending ? t('common.loading') : t('login.button')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

