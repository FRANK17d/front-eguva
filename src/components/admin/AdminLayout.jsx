import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <AdminSidebar />

            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Admin Header (Mobile & User Info) */}
                <header className="h-20 bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4 lg:hidden">
                        <span className="material-icons text-primary dark:text-white">menu</span>
                        <span className="font-display font-bold text-xl uppercase tracking-tighter text-primary dark:text-white">Eguva</span>
                    </div>

                    <div className="hidden lg:block">
                        <h2 className="text-sm font-medium text-gray-400">Panel de Control / <span className="text-gray-900 dark:text-white">Overview</span></h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notifications */}
                        <button className="relative text-gray-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer">
                            <span className="material-icons">notifications</span>
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2"></div>

                        {/* Admin profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Admin Eguva</p>
                                <p className="text-xs text-gray-400">Super Administrador</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-grow p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
