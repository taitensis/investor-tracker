// src/layouts/MainLayout.jsx
import Sidebar from '@ui/Sidebar';
import Topbar from '@ui/Topbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 text-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
