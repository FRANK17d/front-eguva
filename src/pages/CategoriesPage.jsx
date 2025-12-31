import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriasAPI } from '../services/api';
import SEO from '../components/SEO';

// Imágenes por defecto para categorías sin imagen
const defaultImages = {
    ropa: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop',
    zapatos: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
    accesorios: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
    otros: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop',
};

function CategoryCard({ category }) {
    const image = category.imagen || defaultImages[category.slug] || defaultImages.otros;

    return (
        <Link
            to={`/productos?categoria=${category.id}`}
            className="group relative block aspect-square md:aspect-[4/5] overflow-hidden rounded-xl bg-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
        >
            <img
                src={image}
                alt={category.nombre}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                        <span className="material-icons text-white text-2xl">{category.icono || 'category'}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white uppercase mb-2">
                        {category.nombre}
                    </h3>

                    {/* Description */}
                    {category.descripcion && (
                        <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                            {category.descripcion}
                        </p>
                    )}

                    {/* Arrow */}
                    <div className="flex items-center gap-2 mt-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium">Ver productos</span>
                        <span className="material-icons text-sm">arrow_forward</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function CategoriesPage() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setLoading(true);
                const response = await categoriasAPI.getAll();
                setCategorias(response.data);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategorias();
    }, []);

    return (
        <>
            <SEO
                title="Categorías | Eguva - Ropa de Segunda Mano en Perú"
                description="Explora nuestras categorías: Ropa, Zapatos, Accesorios y más. Artículos de segunda mano en excelente estado a precios justos."
                keywords="categorias ropa usada, tipos de ropa segunda mano, zapatos usados peru, accesorios vintage"
            />
            <section className="pt-28 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="font-display text-4xl lg:text-5xl font-bold uppercase text-primary dark:text-white mb-4">
                            Categorías
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Explora nuestras categorías y encuentra exactamente lo que buscas. Cada sección está llena de tesoros esperando por ti.
                        </p>
                    </div>

                    {/* Categories Grid */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500">Cargando categorías...</p>
                        </div>
                    ) : categorias.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {categorias.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">category</span>
                            <p className="text-gray-500 dark:text-gray-400">No hay categorías disponibles.</p>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="mt-16 text-center bg-white dark:bg-card-dark rounded-2xl p-8 md:p-12 shadow-lg">
                        <span className="material-icons text-5xl text-primary dark:text-white mb-4">local_offer</span>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4">
                            ¿Buscas algo específico?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-6">
                            Si no encuentras lo que buscas, contáctame y te ayudo a encontrarlo o te aviso cuando llegue algo similar.
                        </p>
                        <a
                            href="https://wa.me/51994845979?text=Hola!%20Estoy%20buscando%20algo%20específico"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Escríbeme por WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
