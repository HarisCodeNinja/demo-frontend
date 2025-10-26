import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { HeaderActions } from './HeaderActions';
import { LayoutConfig } from '../types';

interface HeaderProps {
  config: LayoutConfig;
  iconClasses: string;
}

export const Header: React.FC<HeaderProps> = ({ config, iconClasses }) => {
  return (
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-5" />
      <div className="flex-1">{/* Breadcrumb can be added here if needed */}</div>
      <div className="flex items-center gap-2 shrink-0">
        <HeaderActions iconClasses={iconClasses} showCompactToggle={config.showCompactToggle} showLanguageSwitcher={config.showLanguageSwitcher} layoutType={config.type} />
      </div>
    </header>
  );
};
