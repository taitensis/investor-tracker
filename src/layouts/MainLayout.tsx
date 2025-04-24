import { Outlet } from 'react-router-dom';
import Topbar from '@/components/ui/Topbar';

export default function MainLayout(): JSX.Element {
  return (
    <div className="h-screen flex flex-col bg-slate-50 text-gray-800">
      <Topbar />
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}