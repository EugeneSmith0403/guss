import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RoundsListPage } from '../pages/RoundsListPage';
import { RoundPage } from '../pages/RoundPage';
import { useUserStore } from '../stores/userStore';

const ProtectedRoute = () => {
  const { token } = useUserStore();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/rounds',
        element: <RoundsListPage />,
      },
      {
        path: '/rounds/:id',
        element: <RoundPage />,
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/rounds" replace />,
  },
]);

