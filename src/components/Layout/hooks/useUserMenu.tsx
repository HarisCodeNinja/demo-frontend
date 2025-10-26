import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLogout } from '@/store/slice/sessionSlice';

interface UseUserMenuProps {
  logoutRedirect?: string;
}

export const useUserMenu = ({ logoutRedirect }: UseUserMenuProps) => {
  const {user} = useAppSelector((state) => state.session);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    dispatch(setLogout());
    if (logoutRedirect) {
      navigate(logoutRedirect);
    }
  }, [dispatch, navigate, logoutRedirect]);

  const handleMenuClick = useCallback((path: string) => {
    const baseScope = user?.scope.find((item:string) => !item.includes(':'));
    if (baseScope) {
      navigate(`/${baseScope}Profile`);
    } else {
      navigate(path);
    }
  }, [navigate, user?.scope]);

  return {
    handleLogout,
    handleMenuClick
  };
};