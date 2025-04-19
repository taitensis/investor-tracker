import {
    UserCircleIcon,
    BriefcaseIcon,
    Cog6ToothIcon,
  } from '@heroicons/react/24/solid'
  
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <UserCircleIcon className="w-4 h-4 me-2" />,
    },
    {
      id: 'portfolios',
      label: 'Portfolios',
      icon: <BriefcaseIcon className="w-4 h-4 me-2" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Cog6ToothIcon className="w-4 h-4 me-2" />,
    },
  ]
  
  export default function Sidebar({ activeTab, setActiveTab }) {
    return (
      <ul className="flex flex-col space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveTab(item.id)}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full transition ${
                activeTab === item.id
                  ? 'bg-blue-700 text-white font-semibold shadow dark:bg-blue-600'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    )
  }  