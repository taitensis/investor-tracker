import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  BanknotesIcon,
} from '@heroicons/react/24/solid'

const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <HomeIcon className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    id: 'portfolios',
    label: 'Portfolios',
    icon: <BriefcaseIcon className="w-5 h-5" />,
    path: '/portfolio',
  },
  {
    id: 'dividends',
    label: 'Dividends',
    icon: <BanknotesIcon className="w-5 h-5" />,
    path: '/dividend',
  },
  /*{
    id: 'assetEditor',
    label: 'Asset Editor',
    icon: <PencilSquareIcon className="w-5 h-5" />,
  },*/
  {
    id: 'settings',
    label: 'Settings',
    icon: <Cog6ToothIcon className="w-5 h-5" />,
    path: '/settings',
  },
]

export default function Sidebar() {
  return (
    <ul className="flex flex-col space-y-2 text-sm font-medium text-gray-500 dark:text-gray-400 p-4">
      {navItems.map((item) => (
        <li key={item.id}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
