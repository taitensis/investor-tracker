import {
    HomeIcon,
    BriefcaseIcon,
    Cog6ToothIcon,
    BanknotesIcon,
  } from '@heroicons/react/24/solid';
  
  export type NavItem = {
    id: string;
    label: string;
    icon: React.ElementType;
    path: string;
    exact?: boolean;
    group?: string;
    roles?: string[]; // optional: e.g., ['admin', 'user']
  };
  
  export const navItems: NavItem[] = [
    {
        id: 'homepage',
        label: 'Homepage',
        icon: HomeIcon,
        path: '/homepage',
        exact: true,
      },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      path: '/dashboard',
      exact: true,
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: BriefcaseIcon,
      path: '/portfolio',
    },
    {
      id: 'dividends',
      label: 'Dividends',
      icon: BanknotesIcon,
      path: '/dividend',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Cog6ToothIcon,
      path: '/settings',
    },
  ];
  