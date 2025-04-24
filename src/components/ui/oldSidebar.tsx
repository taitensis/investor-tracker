// src/components/ui/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { navItems } from '@/constants/nav';

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-primary text-white p-6 space-y-4">
      <h1 className="text-2xl font-bold">Investor Tracker</h1>
      <nav className="space-y-2">
        {navItems.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-blue-700 text-white'
                : 'hover:bg-blue-600 hover:text-white text-blue-100'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
