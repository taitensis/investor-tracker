import Sidebar from '@layouts/Sidebar'

export default function MainLayout({ children }) {
    return (
        <div className='md:flex min-h-screen bg-slate-50 text-gray-800'>
            <Sidebar />
            <main className='p-6 bg-white dark:bg-gray-800 rounded-lg w-full shadow-md'>
                {children}
            </main>
        </div>
    )
}