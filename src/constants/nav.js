// constants/nav.js
import {
    HomeIcon,
    BriefcaseIcon,
    Cog6ToothIcon,
    BanknotesIcon,
} from '@heroicons/react/24/solid';

export const navItems = [
    { id: 'overview', label: 'Overview', icon: HomeIcon, path: '/dashboard' },
    { id: 'portfolios', label: 'Portfolios', icon: BriefcaseIcon, path: '/portfolio' },
    { id: 'dividends', label: 'Dividends', icon: BanknotesIcon, path: '/dividend' },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];
