import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { userOrders, isLoadingUserOrders, errorUserOrders } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoadingUserOrders) {
    return <Preloader />;
  }

  if (errorUserOrders) {
    return <div>{errorUserOrders}</div>;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
