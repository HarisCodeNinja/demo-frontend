import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { GetFontIcon } from '@/util/FontIcons';
import { MenuItem } from '@/interface/common';
import { User } from '../types';

interface UseSidebarProps {
  menus: any[];
  layoutType: 'admin' | 'default';
  user: User | null;
}

export const useSidebar = ({ menus, layoutType, user }: UseSidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [processedMenus, setProcessedMenus] = useState<MenuItem[]>([]);

  const handleMenuClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const hasValidScope = useCallback((itemScope: string[]) => {
    return itemScope.length === 0 || user?.scope?.some(scope => itemScope.includes(scope));
  }, [user]);

  const processMenuChildren = useCallback((children: any[]): any[] => {
    if (!children || children.length === 0) return [];
    
    return children
      .filter((child: any) => hasValidScope(child.scope))
      .map((child: any) => {
        const processedGrandChildren = child.children ? processMenuChildren(child.children) : undefined;
        
        return {
          ...child,
          icon: child.icon,
          label: t(child.label),
          children: processedGrandChildren?.length ? processedGrandChildren : undefined
        };
      })
      .filter((child: any) => !child.children || (child.children && child.children.length > 0));
  }, [hasValidScope, t]);

  useEffect(() => {
    if (!menus || menus.length === 0) {
      setProcessedMenus([]);
      return;
    }

    if (layoutType === 'admin') {
      const processedAdminMenus = menus
        .map((menu) => ({
          ...menu,
          label: t(menu.label),
          icon: menu.icon || Menu,
          children: menu.children ? processMenuChildren(menu.children) : undefined
        }))
        .filter(menu => !menu.children || (menu.children && menu.children.length > 0));
        
      setProcessedMenus(processedAdminMenus);
    } else if (user?.scope) {
      const filteredMenus = menus
        .filter(x => hasValidScope(x.scope))
        .map(x => {
          const processedChildren = x.children ? processMenuChildren(x.children) : undefined;

          return {
            ...x,
            icon: x.icon || Menu,
            label: t(x.label),
            children: processedChildren?.length ? processedChildren : undefined
          };
        })
        .filter(x => !x.children || (x.children && x.children.length > 0));

      setProcessedMenus(filteredMenus);
    } else {
      setProcessedMenus([]);
    }
  }, [menus, layoutType, user, t, hasValidScope, processMenuChildren]);

  return {
    processedMenus,
    handleMenuClick
  };
};