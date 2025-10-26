import React from 'react';
import { LogOut, Building, UserCheck, ChevronsUpDown, BadgeCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserMenu } from '../hooks/useUserMenu';
import { User as UserType } from '../types';
import { useAppDispatch, useAppSelector } from '@/store';
import { setArea } from '@/store/slice/sessionSlice';
import { AppArea } from '@/hooks/useCurrentArea';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

interface UserMenuProps {
  user: UserType | null;
  layoutType: 'default';
  logoutRedirect?: string;
  settingsPath?: string;
  dashboardPath?: string;
  profilePath?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, layoutType, logoutRedirect, profilePath }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentArea = useAppSelector((state) => state.session.area);
  const { isMobile } = useSidebar();

  const { handleLogout, handleMenuClick } = useUserMenu({ logoutRedirect });

  const handleAreaSwitch = (area: AppArea) => {
    dispatch(setArea(area));
    if (area === 'default') {
      navigate('/');
    } else if (area === 'public') {
      navigate('/public');
    }
  };

  const getUserInitials = () => {
    const name = user?.username || 'User';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" variant="outline" className="group/button data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image} alt={user?.username} />
                <AvatarFallback className="rounded-lg group-hover/button:text-sidebar-primary">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.username || 'User'}</span>
                <span className="truncate text-xs">{user?.email || layoutType}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="rounded-lg">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.username || 'User'}</span>
                  <span className="truncate text-xs">{user?.email || layoutType}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleMenuClick(profilePath as string)}>
                <BadgeCheck />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut />
              {t('Logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
