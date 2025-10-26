export interface ThemeVariables {
  colorPrimary: string;
  colorSecondary: string;
  primaryColorText: string;
  secondaryColorText: string;
  colorTextBase: string;
  colorBgBase: string;
  siderBg: string;
  bodyBg: string;
  footerBg: string;
  borderRadius: number;
  fontSize: number;
  headerHeight: number;
  // Dark theme overrides
  colorDarkTextBase: string;
  colorDarkBgBase: string;
  darkSiderBg: string;
  darkBodyBg: string;
  darkFooterBg: string;
}

export const createTheme = (variables: ThemeVariables, isDark: boolean = false) => {
  const {
    colorPrimary,
    colorSecondary,
    primaryColorText,
    secondaryColorText,
    colorTextBase,
    colorBgBase,
    siderBg,
    bodyBg,
    footerBg,
    borderRadius,
    fontSize,
    headerHeight,
    colorDarkTextBase,
    colorDarkBgBase,
    darkSiderBg,
    darkBodyBg,
    darkFooterBg,
  } = variables;

  // Use dark or light values based on isDark flag
  const textColor = isDark ? colorDarkTextBase : colorTextBase;
  const bgColor = isDark ? colorDarkBgBase : colorBgBase;
  const layoutSiderBg = isDark ? darkSiderBg : siderBg;
  const layoutBodyBg = isDark ? darkBodyBg : bodyBg;
  const layoutFooterBg = isDark ? darkFooterBg : footerBg;

  return {
    token: {
      colorPrimary: colorPrimary,
      colorSuccess: colorSecondary,
      colorLink: colorSecondary,
      colorTextBase: textColor,
      colorText: textColor,
      colorBgBase: bgColor,
      borderRadius: borderRadius,
      fontSize: fontSize,
    },
    components: {
      Button: {
        colorPrimary: colorSecondary,
        primaryColor: secondaryColorText,
        colorText: primaryColorText,
        defaultBg: isDark ? '#404040' : '#f5f5f5',
        defaultColor: colorSecondary,
      },
      Layout: {
        headerBg: `linear-gradient(135deg, ${colorPrimary} 0%, ${colorSecondary} 100%)`,
        siderBg: layoutSiderBg,
        bodyBg: layoutBodyBg,
        footerBg: layoutFooterBg,
        headerHeight: headerHeight,
      },
      Menu: {
        itemBg: layoutSiderBg,
        itemColor: isDark ? '#ffffff' : colorPrimary,
        itemSelectedColor: isDark ? '#2c2c2c' : colorPrimary,
      },
    },
  };
}; 