import { useAuth } from '@/contexts/AuthContext';

export default function Topbar() {
    const { user, signOut } = useAuth();

    return (
        <header className="flex justify-end items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
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
