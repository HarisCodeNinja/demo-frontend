import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme, toggleCompact, toggleFullscreen } from '@/store/slice/sessionSlice';

export const useHeaderActions = () => {
  const dispatch = useAppDispatch();
  const { isFullscreen } = useAppSelector((state) => state.session);

  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleCompactToggle = useCallback(() => {
    dispatch(toggleCompact());
  }, [dispatch]);

  const handleFullscreenToggle = useCallback(() => {
    dispatch(toggleFullscreen());
  }, [dispatch]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      if (isCurrentlyFullscreen !== isFullscreen) {
        dispatch(toggleFullscreen());
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen, dispatch]);

  useEffect(() => {
    const applyFullscreen = async () => {
      try {
        if (isFullscreen && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else if (!isFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.warn('Fullscreen operation failed:', error);
      }
    };

    applyFullscreen();
  }, [isFullscreen]);

  return {
    handleThemeToggle,
    handleCompactToggle,
    handleFullscreenToggle,
    isFullscreen,
  };
};
