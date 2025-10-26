import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import { GetFontIcon } from '@/util/FontIcons';
import { MenuItem } from '@/interface/common';

interface UseLayoutMenusProps {
  menus: any[];
  layoutType: 'admin' | 'default';
  user: any;
}

const hasValidScope = (itemScope: string[], userScope: string[]) => 
  itemScope.length === 0 || userScope.some(scope => itemScope.includes(scope));

const processChildren = (children: any[], userScope: string[], t: (key: string) => string) => {
  if (!children) return undefined;
  
  const filteredChildren = children.filter(c => hasValidScope(c.scope, userScope));
  if (filteredChildren.length === 0) return undefined;
  
  return filteredChildren.map(c => ({ ...c, icon: undefined, label: t(c.label) }));
};

export const useLayoutMenus = ({ menus, layoutType, user }: UseLayoutMenusProps) => {
  const { t } = useTranslation();
  const [processedMenus, setProcessedMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (layoutType === 'admin') {
      setProcessedMenus(
        menus.map((menu) => ({
          ...menu,
          label: t(menu.label),
          icon: <Menu className="h-4 w-4" />
        }))
      );
    } else if (menus && user?.scope) {
      const filteredMenus = menus
        .filter(x => hasValidScope(x.scope, user.scope))
        .map(x => ({
          ...x,
          icon: x.icon ? GetFontIcon(x.icon as string) : <Menu className="size-4" />,
          label: t(x.label),
          children: processChildren(x.children, user.scope, t)
        }));
      setProcessedMenus(filteredMenus);
    }
  }, [menus, layoutType, user, t]);

  return processedMenus;
};