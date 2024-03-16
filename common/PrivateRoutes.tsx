import { useAuth } from '@hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  switch (isAuth) {
    case 'checking':
      return <></>;
    case 'authenticated':
      return <Outlet />;
    case 'unauthenticated':
      return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
