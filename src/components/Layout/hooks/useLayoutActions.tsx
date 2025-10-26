import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { setLogout, toggleTheme, toggleCompact } from '@/store/slice/sessionSlice';

interface UseLayoutActionsProps {
  logoutRedirect?: string;
}

export const useLayoutActions = ({ logoutRedirect }: UseLayoutActionsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    dispatch(setLogout());
    if (logoutRedirect) {
      navigate(logoutRedirect);
    }
  }, [dispatch, navigate, logoutRedirect]);

  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleCompactToggle = useCallback(() => {
    dispatch(toggleCompact());
  }, [dispatch]);

  const handleMenuClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return {
    handleLogout,
    handleThemeToggle,
    handleCompactToggle,
    handleMenuClick
  };
};