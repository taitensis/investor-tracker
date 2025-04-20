import {
    HomeIcon,
    BriefcaseIcon,
    PencilSquareIcon,
    Cog6ToothIcon,
  } from '@heroicons/react/24/solid'
  
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      id: 'portfolios',
      label: 'Portfolios',
      icon: <BriefcaseIcon className="w-5 h-5" />,
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
    },
  ]
  
  export default function Sidebar({ activeTab, setActiveTab }) {
    return (
      <ul className="flex flex-col space-y-2 text-sm font-medium text-gray-500 dark:text-gray-400 p-4">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    )
  }
  