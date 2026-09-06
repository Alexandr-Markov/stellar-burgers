import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const { user } = useSelector((state) => state.user);
  const name = user?.name || '';
  return <AppHeaderUI userName={name} />;
};
