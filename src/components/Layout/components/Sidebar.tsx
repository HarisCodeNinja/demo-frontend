import React, { useState } from 'react';
import { useSidebar as useSidebarHook } from '../hooks/useSidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { LayoutConfig, User } from '../types';
import { MenuItem } from '@/interface/common';
import { useLocation } from 'react-router-dom';
import { ChevronRight, FileIcon } from 'lucide-react';
import { RootState, useAppSelector } from '@/store';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { UserMenu } from './UserMenu';

interface SidebarProps {
  config: LayoutConfig;
  user: User | null;
}

interface MenuItemComponentProps {
  menu: MenuItem;
  level: number;
  expandedMenus: Set<string>;
  toggleMenu: (key: string) => void;
  handleMenuClick: (key: string) => void;
  currentPath: string;
}

const isMenuActive = (menuKey: string, currentPath: string, hasChildren: boolean): boolean => {
  if (!hasChildren) {
    return currentPath === menuKey;
  }

  if (currentPath === menuKey) {
    return true;
  }

  return currentPath.startsWith(menuKey + '/');
};

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ menu, level, expandedMenus, toggleMenu, handleMenuClick, currentPath }) => {
  const IconComponent = menu.icon || FileIcon;
  const hasChildren = menu.children && menu.children.length > 0;
  const isExpanded = expandedMenus.has(menu.key);
  const isActive = isMenuActive(menu.key, currentPath, hasChildren as boolean);

  const handleClick = () => {
    if (!hasChildren) {
      handleMenuClick(menu.key);
    }
  };

  if (level === 0) {
    return (
      <Collapsible key={menu.key} open={isExpanded} onOpenChange={() => toggleMenu(menu.key)} className="group/collapsible">
        <SidebarMenuItem>
          {hasChildren ? (
            <>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={menu.label} isActive={isActive}>
                  {IconComponent && <IconComponent />}
                  <span>{menu.label}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="border-0">
                  {menu.children!.map((child) => (
                    <MenuItemComponent
                      key={child.key}
                      menu={child}
                      level={level + 1}
                      expandedMenus={expandedMenus}
                      toggleMenu={toggleMenu}
                      handleMenuClick={handleMenuClick}
                      currentPath={currentPath}
                    />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </>
          ) : (
            <SidebarMenuButton onClick={handleClick} isActive={isActive} tooltip={menu.label}>
              {IconComponent && <IconComponent />}
              <span>{menu.label}</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Sub-menu items
  return (
    <SidebarMenuSubItem key={menu.key}>
      <SidebarMenuSubButton onClick={handleClick} isActive={isActive} asChild>
        <a>
          <span>{menu.label}</span>
        </a>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ config, user }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const { open } = useSidebar();
  const { isDarkTheme } = useAppSelector((state: RootState) => state.session);
  const { processedMenus, handleMenuClick } = useSidebarHook({
    menus: config.menus,
    layoutType: config.type,
    user,
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  React.useEffect(() => {
    const currentPath = location.pathname;
    const findAndExpandParents = (menus: MenuItem[], currentExpanded: Set<string>) => {
      menus.forEach((menu) => {
        if (menu.children) {
          const hasActiveChild = checkIfHasActiveChild(menu.children, currentPath);
          if (hasActiveChild) {
            currentExpanded.add(menu.key);
          }
          findAndExpandParents(menu.children, currentExpanded);
        }
      });
    };

    const checkIfHasActiveChild = (children: MenuItem[], path: string): boolean => {
      return children.some((child) => {
        if (child.children) {
          return path.startsWith(child.key + '/') || checkIfHasActiveChild(child.children, path);
        }
        return path === child.key;
      });
    };

    const newExpanded = new Set<string>();
    findAndExpandParents(processedMenus, newExpanded);
    setExpandedMenus(newExpanded);
  }, [location.pathname, processedMenus]);

  const logoSrc = React.useMemo(() => {
    if (config.logoLightPath && config.logoDarkPath) {
      return isDarkTheme ? config.logoDarkPath : config.logoLightPath;
    }
    return config.logoPath;
  }, [isDarkTheme, config.logoLightPath, config.logoDarkPath, config.logoPath]);

  return (
    <SidebarComponent collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-16 justify-center items-center">
        {open ? (
          <img src={logoSrc} alt={config.title} className="w-auto h-auto max-w-[200px] max-h-[40px]" />
        ) : (
          <div className="flex aspect-square size-8 items-center justify-center">
            <img src={logoSrc} className="size-8 object-contain" alt={config.title} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {processedMenus.map((menu) => (
              <MenuItemComponent
                key={menu.key}
                menu={menu}
                level={0}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
                handleMenuClick={handleMenuClick}
                currentPath={location.pathname}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu
          user={user}
          layoutType={config.type}
          logoutRedirect={config.logoutRedirect}
          settingsPath={config.settingsPath}
          dashboardPath={config.dashboardPath}
          profilePath={config.profilePath}
        />
      </SidebarFooter>
      <SidebarRail />
    </SidebarComponent>
  );
};
