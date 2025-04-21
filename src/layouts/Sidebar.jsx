import { NavLink } from 'react-router-dom';
import { navItems } from '@/constants/nav';

export default function Sidebar() {
  return (
    <ul className="flex flex-col space-y-2 text-sm font-medium text-gray-500 dark:text-gray-400 p-4">
      {navItems.map(({ id, label, icon: Icon, path }) => (
        <li key={id}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="truncate">{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
