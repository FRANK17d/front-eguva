import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoEguva from '../assets/logo-eguva.png';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);
    const location = useLocation();

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
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                            aria-label="Lista de deseos"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">favorite_border</span>
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/carrito"
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors relative cursor-pointer"
                            aria-label="Carrito de compras"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">shopping_bag</span>
                            <span className="absolute top-0 right-0 h-5 w-5 bg-primary dark:bg-white text-white dark:text-primary rounded-full text-xs font-bold flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {/* User Account */}
                        <div className="relative" ref={accountMenuRef}>
                            <button
                                className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-all cursor-pointer ${isAccountMenuOpen ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                aria-label="Mi cuenta"
                            >
                                <span className="material-icons text-gray-600 dark:text-gray-300">person_outline</span>
                            </button>

                            {/* Dropdown Popup */}
                            <div
                                className={`absolute right-0 mt-3 w-56 bg-white dark:bg-card-dark rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 transform origin-top-right ${isAccountMenuOpen
                                    ? 'opacity-100 scale-100'
                                    : 'opacity-0 scale-95 pointer-events-none'
                                    }`}
                            >
                                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bienvenido a Eguva</p>
                                </div>
                                <div className="p-2">
                                    <Link
                                        to="/iniciar-sesión"
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                                    >
                                        <span className="material-icons text-xl text-gray-400 group-hover:text-primary dark:group-hover:text-white transition-colors">login</span>
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        to="/registro"
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                                    >
                                        <span className="material-icons text-xl text-gray-400 group-hover:text-primary dark:group-hover:text-white transition-colors">person_add_alt</span>
                                        Registrarse
                                    </Link>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-900/50">
                                    <p className="text-[10px] text-gray-400 text-center">Moda sostenible con propósito</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menú"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
                        }`}
                >
                    <div className="flex flex-col space-y-2 pt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${isActive(link.href)
                                    ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

