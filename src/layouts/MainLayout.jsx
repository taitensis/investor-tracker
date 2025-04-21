import Sidebar from '@layouts/Sidebar';
import Topbar from '@layouts/TopBar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="md:flex min-h-screen bg-slate-50 text-gray-800">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Topbar />
        <main className="p-6 bg-white dark:bg-gray-800 rounded-lg w-full shadow-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
