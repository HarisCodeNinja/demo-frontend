import { ThemeVariables } from './themeFactory';
import { AppArea } from '@/hooks/useCurrentArea';

// Default Area Theme Variables
export const defaultThemeVariables: ThemeVariables = {
	colorPrimary: '#ff00ff',
	colorSecondary: '#ff00ff',
	primaryColorText: '#ff00ff',
	secondaryColorText: '#ff00ff',
	colorTextBase: '#a4a4a4',
	colorBgBase: '#a4a4a4',
	siderBg: '#a4a4a4',
	bodyBg: '#a4a4a4',
	footerBg: '#a4a4a4',
	borderRadius: 8,
	fontSize: 16,
	headerHeight: 64,
	// Dark theme overrides
	colorDarkTextBase: '#ffffff',
	colorDarkBgBase: '#4e4d4d',
	darkSiderBg: '#2c2c2c',
	darkBodyBg: '#4e4d4d',
	darkFooterBg: '#707070',
};

// Public Area Theme Variables
export const publicThemeVariables: ThemeVariables = {
	colorPrimary: '#ff00ff',
	colorSecondary: '#ff00ff',
	primaryColorText: '#ff00ff',
	secondaryColorText: '#ff00ff',
	colorTextBase: '#a4a4a4',
	colorBgBase: '#a4a4a4',
	siderBg: '#a4a4a4',
	bodyBg: '#a4a4a4',
	footerBg: '#a4a4a4',
	borderRadius: 8,
	fontSize: 16,
	headerHeight: 64,
	// Dark theme overrides
	colorDarkTextBase: '#ffffff',
	colorDarkBgBase: '#1f1f1f',
	darkSiderBg: '#141414',
	darkBodyBg: '#1f1f1f',
	darkFooterBg: '#262626',
};

// Theme variables mapping
export const areaThemeVariables: Record<AppArea, ThemeVariables> = {
	public: publicThemeVariables,
	default: defaultThemeVariables,
};
