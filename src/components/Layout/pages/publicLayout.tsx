import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer';

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { user, isDarkTheme } = useAppSelector((state: any) => state.session);

  const logoSrc = React.useMemo(() => {
    return isDarkTheme ? '/logoDefaultArea-dark.png' : '/logoDefaultArea-light.png';
  }, [isDarkTheme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setPopoverOpen(false);
      }
    };

    if (popoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverOpen]);

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 bg-background border-b sticky top-0 z-50">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link to={'/'}>
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="h-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            {user ? (
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={togglePopover}>
                    <User className="h-4 w-4 me-2" />
                    {user?.username || 'User'}
                    <ChevronDown className="h-4 w-4 ms-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" ref={popoverRef}>
                  <div className="flex flex-col gap-1">
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">Signed in as {user?.username}</div>
                    <div className="border-t pt-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setPopoverOpen(false);
                          navigate('/profile');
                        }}>
                        <User className="h-4 w-4 me-2" />
                        Profile
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/userLogin')}>
                  {t('Login')}
                </Button>
                <Button onClick={() => navigate('/userRegister')}>{t('Register')}</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
