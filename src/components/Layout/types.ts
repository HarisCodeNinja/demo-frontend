export interface LayoutConfig {
  type: 'admin' | 'default';
  title: string;
  logoPath?: string;
  showFooter?: boolean;
  showCompactToggle?: boolean;
  showLanguageSwitcher?: boolean;
  logoutRedirect?: string;
  settingsPath?: string;
  dashboardPath?: string;
  profilePath?: string;
  footerText?: string;
  menus: any[];
}

export interface User {
  username?: string;
  name?: string;
  scope?: string[];
  avatar?: string;
  image?: string;
  email?: string;
}