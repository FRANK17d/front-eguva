import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { name: 'Productos', icon: 'inventory_2', href: '/admin/productos' },
    { name: 'Pedidos', icon: 'shopping_cart', href: '/admin/pedidos' },
    { name: 'Categorías', icon: 'category', href: '/admin/categorias' },
    { name: 'Clientes', icon: 'people', href: '/admin/clientes' },
    { name: 'Configuración', icon: 'settings', href: '/admin/configuracion' },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
    const location = useLocation();

    // Cerrar sidebar al cambiar de ruta en móvil
    useEffect(() => {
        setIsOpen(false);
    }, [location, setIsOpen]);

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`w-64 bg-primary dark:bg-card-dark text-white min-h-screen fixed left-0 top-0 z-50 flex flex-col border-r border-gray-800 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-8 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-2">
                            <img src="/src/assets/logo-eguva.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-lg uppercase tracking-wider">Eguva</h1>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Admin Panel</p>
                        </div>
                    </div>
                    {/* Close button mobile */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <nav className="flex-grow p-4 mt-6">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-white text-primary shadow-lg shadow-black/20'
                                            : 'hover:bg-white/10 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span className={`material-icons ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 mt-auto border-t border-gray-800">
                    <Link
                        to="/"
                        className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition-colors group"
                    >
                        <span className="material-icons group-hover:translate-x-[-4px] transition-transform">logout</span>
                        <span className="font-medium">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
