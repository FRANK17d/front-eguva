import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import logoEguva from '../assets/logo-eguva.png';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
                setIsAccountMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsAccountMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Categorías', href: '/categorias' },
        { name: 'Productos', href: '/productos' },
        { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        setIsAccountMenuOpen(false);
        await logout();
        navigate('/');
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm'
                : 'bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md'
                } border-b border-gray-200 dark:border-gray-800`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
                        <div className="h-12 w-12 bg-primary dark:bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                            <img src={logoEguva} alt="Eguva Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-display font-bold text-2xl tracking-tighter uppercase text-primary dark:text-white hidden sm:block">
                            Eguva
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-sm font-medium transition-colors relative group cursor-pointer ${isActive(link.href)
                                    ? 'text-primary dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary dark:bg-white transition-all duration-300 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`} />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 sm:space-x-3">
                        {/* Wishlist */}
                        <Link
                            to="/favoritos"
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors relative cursor-pointer"
                            aria-label="Lista de deseos"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">favorite_border</span>
                            {wishlistCount > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-primary dark:bg-white text-white dark:text-primary rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/carrito"
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors relative cursor-pointer"
                            aria-label="Carrito de compras"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">shopping_bag</span>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 h-5 w-5 bg-primary dark:bg-white text-white dark:text-primary rounded-full text-xs font-bold flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Account Dropdown */}
                        <div className="relative" ref={accountMenuRef}>
                            <button
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                                aria-label="Cuenta de usuario"
                            >
                                {isAuthenticated && user?.nombre ? (
                                    <div className="w-7 h-7 bg-primary dark:bg-white rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-white dark:text-primary uppercase">
                                            {user.nombre.split(' ').length > 1
                                                ? user.nombre.split(' ').slice(0, 2).map(n => n[0]).join('')
                                                : user.nombre.slice(0, 2)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="material-icons text-gray-600 dark:text-gray-300">person</span>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isAccountMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-card-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 animate-fade-in">
                                    {isAuthenticated ? (
                                        <>
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                    {user?.nombre}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
                                                    {user?.rol === 'administrador' ? 'Administrador' : 'Usuario'}
                                                </p>
                                            </div>

                                            {/* Admin Panel Link (only for admins) */}
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                                >
                                                    <span className="material-icons text-primary dark:text-white text-xl">dashboard</span>
                                                    <span className="font-medium">Panel de Administración</span>
                                                </Link>
                                            )}

                                            {/* Mis Pedidos */}
                                            <Link
                                                to="/mis-pedidos"
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                            >
                                                <span className="material-icons text-primary dark:text-white text-xl">shopping_bag</span>
                                                <span className="font-medium">Mis Pedidos</span>
                                            </Link>

                                            {/* Logout */}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                                            >
                                                <span className="material-icons text-xl">logout</span>
                                                <span className="font-medium">Cerrar sesión</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {/* Login Link */}
                                            <Link
                                                to="/iniciar-sesión"
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                            >
                                                <span className="material-icons text-primary dark:text-white text-xl">login</span>
                                                <span className="font-medium">Iniciar sesión</span>
                                            </Link>

                                            {/* Register Link */}
                                            <Link
                                                to="/registro"
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                            >
                                                <span className="material-icons text-primary dark:text-white text-xl">person_add</span>
                                                <span className="font-medium">Crear cuenta</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                            aria-label="Menú"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 animate-fade-in">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${isActive(link.href)
                                    ? 'bg-gray-100 dark:bg-gray-800 text-primary dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
