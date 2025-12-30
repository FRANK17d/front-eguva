import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const mockFavorites = [
    {
        id: 3,
        name: 'Camisa a Cuadros',
        category: 'Ropa',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    },
    {
        id: 4,
        name: 'Bolso de Cuero Vintage',
        category: 'Accesorios',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop',
    }
];

export default function WishlistPage() {
    const [favorites, setFavorites] = useState(mockFavorites);

    const toggleFavorite = (id) => {
        setFavorites(prev => prev.filter(item => item.id !== id));
    };

    return (
        <>
            <SEO
                title="Mis Favoritos | Eguva"
                description="Guarda tus prendas favoritas y no pierdas la oportunidad de darles una segunda vida."
            />

            <section className="pt-32 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h1 className="font-display text-4xl font-bold uppercase text-primary dark:text-white tracking-tight">
                                Mis Favoritos
                            </h1>
                            <p className="text-gray-500 mt-2">Productos que te encantaron y quieres seguir de cerca.</p>
                        </div>
                        <p className="text-sm font-medium text-gray-400">
                            {favorites.length} {favorites.length === 1 ? 'artículo' : 'artículos'} guardados
                        </p>
                    </div>

                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {favorites.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-800 relative"
                                >
                                    {/* Remove button */}
                                    <button
                                        onClick={() => toggleFavorite(product.id)}
                                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                        aria-label="Eliminar de favoritos"
                                    >
                                        <span className="material-icons text-lg">close</span>
                                    </button>

                                    {/* Image Container */}
                                    <Link to={`/producto/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                    </Link>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base line-clamp-1 mb-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-500 text-xs mb-3">{product.category}</p>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-display font-bold text-lg text-primary dark:text-white">
                                                S/{product.price.toFixed(2)}
                                            </p>
                                            <button
                                                className="bg-primary dark:bg-white text-white dark:text-primary p-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center"
                                                aria-label="Añadir al carrito"
                                            >
                                                <span className="material-icons text-sm">add_shopping_cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-32 bg-white dark:bg-card-dark rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 duration-500">
                                <span className="material-icons text-4xl text-gray-300">favorite_border</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aún no tienes favoritos</h2>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Cuando veas algo que te guste, haz clic en el corazón para guardarlo aquí.</p>
                            <Link
                                to="/productos"
                                className="inline-flex items-center gap-2 bg-primary dark:bg-white text-white dark:text-primary px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-primary/10"
                            >
                                Descubrir tesoros
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
