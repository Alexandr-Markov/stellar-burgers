import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom'; // Убедись, что путь верный
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const { user, isAuth } = useSelector((state) => state.user);
  const location = useLocation();

  if (isAuth === undefined) {
    return <Preloader />;
  }

  if (onlyUnAuth) {
    if (user) {
      const from = location.state?.from || { pathname: '/' };
      return <Navigate replace to={from.pathname} />;
    }
    return children;
  }

  if (!user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
