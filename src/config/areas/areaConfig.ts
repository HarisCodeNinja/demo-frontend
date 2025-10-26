import React from 'react';
import { AppArea } from '@/hooks/useCurrentArea';
import { CustomRoutes } from '@/interface/common';
import { ThemeVariables } from '@/config/themes/themeFactory';
import { areaThemeVariables } from '@/config/themes/themeVariables';

// Layout imports
import {DefaultLayout, PublicLayout } from '@/components/Layout';

// Route imports
import {defaultRoutes, publicRoutes } from '@/config/routes';
export interface AreaConfiguration {
	name: string;
	layout: React.ComponentType;
	routes: CustomRoutes[];
	themeVariables: ThemeVariables;
	requiresAuth: boolean;
	styleSheet?: string;
}

export const areaConfigurations: Record<AppArea, AreaConfiguration> = {
	public: {
		name: 'Public',
		layout: PublicLayout,
		routes: publicRoutes,
		themeVariables: areaThemeVariables.public,
		requiresAuth: false,
		styleSheet: 'main.scss',
	},
	default: {
		name: 'Default Area',
		layout: DefaultLayout,
		routes: defaultRoutes,
		themeVariables: areaThemeVariables.default,
		requiresAuth: true,
		styleSheet: 'main.scss',
	}
};

// Helper functions
export const getAreaConfig = (area: AppArea): AreaConfiguration => {
	return areaConfigurations[area];
};

export const getAreaThemeVariables = (area: AppArea): ThemeVariables => {
	return areaConfigurations[area].themeVariables;
};

export const getAreaLayout = (area: AppArea): React.ComponentType => {
	return areaConfigurations[area].layout;
};

export const getAreaRoutes = (area: AppArea): CustomRoutes[] => {
	return areaConfigurations[area].routes;
};
