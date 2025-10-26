import { useMemo } from 'react';

interface LayoutConfig {
  type: 'admin' | 'default';
  title: string;
  logoPath?: string;
  showFooter?: boolean;
  showCompactToggle?: boolean;
  showLanguageSwitcher?: boolean;
  logoutRedirect?: string;
  settingsPath?: string;
  dashboardPath?: string;
  footerText?: string;
  menus: any[];
}

export const useLayoutConfig = (config: LayoutConfig) => {
  const iconClasses = useMemo(() => {
    return config.type === 'admin' ? 'h-4 w-4' : 'size-4';
  }, [config.type]);

  const logoClasses = useMemo(() => {
    return config.type === 'admin' ? "h-8 w-8" : "size-8";
  }, [config.type]);

  const shouldShowLanguageSwitcher = useMemo(() => {
    if (!config.showLanguageSwitcher) return false;
    
    return true;
  }, [config.showLanguageSwitcher, config.type]);

  return {
    iconClasses,
    logoClasses,
    shouldShowLanguageSwitcher
  };
};