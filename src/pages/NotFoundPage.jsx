import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFoundPage() {
    return (
        <>
            <SEO
                title="Página no encontrada | Eguva"
                description="La página que buscas no existe. Vuelve al inicio de Eguva."
                keywords="404, página no encontrada, error"
            />

            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full opacity-50 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full opacity-50 blur-3xl" />
                </div>

                <div className="max-w-2xl w-full text-center relative animate-fade-in">
                    {/* 404 Icon */}
                    <div className="mb-6 relative">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 dark:from-white dark:to-gray-200 rounded-full shadow-xl mb-0">
                            <span className="material-icons text-white dark:text-primary" style={{ fontSize: '2.5rem' }}>
                                error_outline
                            </span>
                        </div>

                        {/* Animated circles */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-primary/20 dark:border-white/20 rounded-full animate-ping" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-4 border-primary/10 dark:border-white/10 rounded-full animate-pulse" />
                    </div>

                    {/* Error Code */}
                    <h1 className="font-display text-6xl md:text-7xl font-bold text-primary dark:text-white mb-3 tracking-tight">
                        404
                    </h1>

                    {/* Message */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        ¡Ups! Página no encontrada
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-base mb-6 max-w-md mx-auto">
                        La página que buscas no existe o ha sido movida. Vuelve al inicio para seguir explorando.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer text-sm"
                        >
                            <span className="material-icons text-lg">home</span>
                            <span>Volver al inicio</span>
                        </Link>

                        <Link
                            to="/productos"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-card-dark border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer text-sm"
                        >
                            <span className="material-icons text-lg">shopping_bag</span>
                            <span>Ver productos</span>
                        </Link>
                    </div>

                    {/* Popular Links */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wider">
                            Enlaces populares
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link
                                to="/categorias"
                                className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                Categorías
                            </Link>
                            <Link
                                to="/sobre-nosotros"
                                className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                Sobre Nosotros
                            </Link>
                            <Link
                                to="/preguntas-frecuentes"
                                className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                Ayuda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
