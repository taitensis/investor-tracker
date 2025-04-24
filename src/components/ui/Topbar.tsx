import { NavLink } from 'react-router-dom';
import { navItems } from '@/constants/nav';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Topbar(): JSX.Element {
  const { user, signOut } = useAuth();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
    : '??';

  return (
    <header className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4 py-4 border-b bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
      {/* Branding + Mobile Logout */}
      <div className="flex justify-between items-center w-full sm:w-auto">
      <h1 className="text-xl font-bold text-primary dark:text-white">
      Investor Tracker
    </h1>


        <div className="sm:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
          <Button variant="destructive" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap gap-2 justify-start sm:justify-center">
        {navItems.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Desktop Logout */}
      <div className="hidden sm:flex items-center gap-3 justify-end">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>
        <Button variant="destructive" size="sm" onClick={signOut}>
          Sign Out
        </Button>

      {/* Theme toggle */}
      <ThemeToggle />
      </div>
    </header>
  );
}
