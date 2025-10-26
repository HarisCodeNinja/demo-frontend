import { SidebarProvider } from '@/components/ui/sidebar';
import { RootState, useAppSelector } from '@/store';
import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useLayoutClassManagement } from '../hooks/useLayoutClassManagement';
import { LayoutConfig } from '../types';

interface UnifiedLayoutProps {
  config: LayoutConfig;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ config }) => {
  const { isLoggedIn, user, isDarkTheme, isCompactTheme } = useAppSelector((state: RootState) => state.session);

  useLayoutClassManagement({
    layoutType: config.type,
    isLoggedIn,
    isDarkTheme,
    isCompactTheme,
  });

  const iconClasses = useMemo(() => (config.type === 'admin' ? 'h-4 w-4' : 'size-4'), [config.type]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <Sidebar config={config} user={user} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header config={config} iconClasses={iconClasses} />
          <main id={config.type === 'default' ? 'contentMain' : undefined} className="flex-1 p-4 sm:p-6 overflow-auto">
            <Outlet />
          </main>
          {config.showFooter && <Footer footerText={config.footerText} />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UnifiedLayout;
