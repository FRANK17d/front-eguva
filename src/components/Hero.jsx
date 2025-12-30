import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Decorative Blurs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl dark:bg-secondary/10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-gray-400/20 rounded-full blur-3xl dark:bg-gray-700/10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="space-y-8 animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/30 backdrop-blur-sm">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                            <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                Nuevos artículos cada semana
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight text-primary dark:text-white">
                            ROPA Y MÁS <br />
                            <span className="gradient-text">CON HISTORIA</span> <br />
                            A TU ALCANCE
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md font-light leading-relaxed">
                            Bienvenido a <strong>Eguva</strong>. Aquí encontrarás ropa, zapatos y accesorios de segunda mano en excelente estado, seleccionados con cariño y a precios increíbles. 💚
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/productos"
                                className="btn-primary cursor-pointer"
                            >
                                Ver Productos
                            </Link>
                            <Link
                                to="/sobre-nosotros"
                                className="btn-secondary cursor-pointer"
                            >
                                Conoce Nuestra Historia
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="material-icons text-lg text-green-500">check_circle</span>
                                <span>Calidad verificada</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-icons text-lg text-green-500">eco</span>
                                <span>Moda sostenible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-icons text-lg text-green-500">favorite</span>
                                <span>Atención personalizada</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative lg:h-[500px] w-full flex justify-center items-center pb-8">
                        {/* Decorative Frame */}
                        <div className="absolute top-10 -left-10 w-64 h-80 border-2 border-gray-300 dark:border-gray-700 rounded-lg hidden lg:block" />

                        {/* Main Image Container */}
                        <div className="relative z-10 w-full max-w-md aspect-[3/4] rounded-lg overflow-visible shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 group cursor-pointer">
                            <img
                                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop"
                                alt="Colección de ropa de segunda mano"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 rounded-lg">
                                <span className="text-white font-display text-2xl uppercase">Nueva Colección</span>
                            </div>

                            {/* Impact Badge */}
                            <div
                                className="absolute -bottom-4 -right-4 z-20 bg-white dark:bg-card-dark p-4 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 animate-bounce-slow"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                        <span className="material-icons text-green-600 dark:text-green-400">savings</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Ahorra hasta</p>
                                        <p className="text-sm font-bold text-primary dark:text-white">70% vs tiendas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
