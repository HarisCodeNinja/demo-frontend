import { useState, useCallback, useEffect } from 'react';

interface UseSidebarToggleProps {
  layoutType: 'admin' | 'default';
}

const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';

export const useSidebarToggle = ({ layoutType }: UseSidebarToggleProps) => {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        return true; 
      }
      
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setCollapsed(true);
      } else {
        const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        setCollapsed(saved ? JSON.parse(saved) : false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev:any) => {
      const newCollapsed = !prev;
      
      if (!isMobile) {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newCollapsed));
      }
      
      if (layoutType === 'default') {
        const contentMain = document.getElementById('contentMain');
        if (contentMain) {
          newCollapsed 
            ? contentMain.classList.add('shadcn-layout-collapsed') 
            : contentMain.classList.remove('shadcn-layout-collapsed');
        }
      }
      
      return newCollapsed;
    });
  }, [layoutType, isMobile]);

  return { collapsed, toggleSidebar, isMobile };
};