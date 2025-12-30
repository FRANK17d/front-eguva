import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoEguva from '../assets/logo-eguva.png';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
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
                        <button
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                            aria-label="Lista de deseos"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">favorite_border</span>
                        </button>

                        {/* Cart */}
                        <button
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors relative cursor-pointer"
                            aria-label="Carrito de compras"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">shopping_bag</span>
                            <span className="absolute top-0 right-0 h-5 w-5 bg-primary dark:bg-white text-white dark:text-primary rounded-full text-xs font-bold flex items-center justify-center">
                                0
                            </span>
                        </button>

                        {/* User Account */}
                        <button
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                            aria-label="Mi cuenta"
                        >
                            <span className="material-icons text-gray-600 dark:text-gray-300">person_outline</span>
                        </button>

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
