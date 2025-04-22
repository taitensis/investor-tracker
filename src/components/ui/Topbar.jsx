// src/components/ui/Topbar.jsx
import { useAuth } from '@/contexts/AuthContext';

export default function Topbar() {
    const { user, signOut } = useAuth();

    const initials = user?.name
        ? user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
        : '??';

    return (
        <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="text-lg font-semibold text-primary">Dashboard</div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {initials}
                </div>
                <button
                    onClick={signOut}
                    className="text-sm font-medium bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
}
