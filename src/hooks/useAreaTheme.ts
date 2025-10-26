import { useMemo } from 'react';
import { RootState, useAppSelector } from '@/store';
import { useCurrentArea } from './useCurrentArea';
import { getAreaConfig, getAreaThemeVariables } from '@/config/areas/areaConfig';
import { createTheme } from '@/config/themes/themeFactory';

/**
 * Hook to get area-specific theme information and utilities
 * Useful for component-level theme customization
 */
export const useAreaTheme = () => {
  const currentArea = useCurrentArea();
  const isDarkTheme = useAppSelector((state: RootState) => state.session.isDarkTheme);
  const isCompactTheme = useAppSelector((state: RootState) => state.session.isCompactTheme);
  
  const areaConfig = useMemo(() => getAreaConfig(currentArea), [currentArea]);
  const themeVariables = useMemo(() => getAreaThemeVariables(currentArea), [currentArea]);
  const compiledTheme = useMemo(() => createTheme(themeVariables, isDarkTheme), [themeVariables, isDarkTheme]);
  
  return {
    // Current area info
    currentArea,
    areaConfig,
    
    // Theme state
    isDarkTheme,
    isCompactTheme,
    
    // Theme variables and compiled theme
    themeVariables,
    compiledTheme,
    
    // Quick access to common theme values
    colors: {
      primary: themeVariables.colorPrimary,
      secondary: themeVariables.colorSecondary,
      text: isDarkTheme ? themeVariables.colorDarkTextBase : themeVariables.colorTextBase,
      background: isDarkTheme ? themeVariables.colorDarkBgBase : themeVariables.colorBgBase,
    },
    
    // Helper functions
    getColor: (colorKey: keyof typeof themeVariables) => themeVariables[colorKey],
    isArea: (area: string) => currentArea === area,
  };
};

export default useAreaTheme; 