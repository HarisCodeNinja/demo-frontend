import { defaultMenus } from '@/config/menus/defaultMenus';

export const defaultLayoutConfig = {
  type: 'default' as const,
  title: 'Default Area',
  logoPath: '/logo.png',
  showFooter: true,
  showCompactToggle: true,
  showLanguageSwitcher: false,
  logoutRedirect: '/userLogin',
  settingsPath: '/settings',
  menus: defaultMenus,
  profilePath: '/profile'
};