import { useState } from 'react';
import SEO from '../components/SEO';

const allProducts = [
    {
        id: 1,
        name: 'Chaqueta Denim Clásica',
        category: 'ropa',
        condition: 'Excelente',
        price: 89.00,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop',
    },
    {
        id: 2,
        name: 'Zapatillas Nike Air',
        category: 'zapatos',
        condition: 'Muy Bueno',
        price: 120.00,
        originalPrice: 180.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    },
    {
        id: 3,
        name: 'Camisa a Cuadros',
        category: 'ropa',
        condition: 'Excelente',
        price: 35.00,
        originalPrice: 45.00,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    },
    {
        id: 4,
        name: 'Bolso de Cuero Vintage',
        category: 'accesorios',
        condition: 'Bueno',
        price: 65.00,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop',
    },
    {
        id: 5,
        name: 'Vestido Floral',
        category: 'ropa',
        condition: 'Excelente',
        price: 55.00,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    },
    {
        id: 6,
        name: 'Tenis Converse',
        category: 'zapatos',
        condition: 'Muy Bueno',
        price: 75.00,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
    },
    {
        id: 7,
        name: 'Pantalón Jogger',
        category: 'ropa',
        condition: 'Excelente',
        price: 45.00,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
    },
    {
        id: 8,
        name: 'Reloj Clásico',
        category: 'accesorios',
        condition: 'Muy Bueno',
        price: 95.00,
        originalPrice: 150.00,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop',
    },
];

const categories = [
    { id: 'todos', name: 'Todos', icon: 'grid_view' },
    { id: 'ropa', name: 'Ropa', icon: 'checkroom' },
    { id: 'zapatos', name: 'Zapatos', icon: 'steps' },
    { id: 'accesorios', name: 'Accesorios', icon: 'watch' },
];

function ProductCard({ product }) {
    const conditionColor = {
        'Excelente': 'bg-green-500',
        'Muy Bueno': 'bg-blue-500',
        'Bueno': 'bg-yellow-500',
    };

    return (
        <div className="group cursor-pointer bg-white dark:bg-card-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover-card">
            <div className="relative overflow-hidden aspect-[4/5]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Condition Badge */}
                <div className={`absolute top-3 left-3 ${conditionColor[product.condition]} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {product.condition}
                </div>

                {/* Discount Badge */}
                {product.originalPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        className="flex-1 bg-primary dark:bg-white text-white dark:text-primary py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                        aria-label="Añadir al carrito"
                    >
                        <span className="material-icons text-sm">add_shopping_cart</span>
                        Añadir
                    </button>
                    <button
                        className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        aria-label="Añadir a favoritos"
                    >
                        <span className="material-icons text-gray-600 dark:text-gray-300 text-sm">favorite_border</span>
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base group-hover:text-primary dark:group-hover:text-gray-300 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm mt-1 capitalize">
                    {product.category}
                </p>

                {/* Price in Soles */}
                <div className="mt-3 flex items-center gap-2">
                    <p className={`font-display font-bold text-lg ${product.originalPrice ? 'text-red-600' : 'text-primary dark:text-white'}`}>
                        S/{product.price.toFixed(2)}
                    </p>
                    {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">
                            S/{product.originalPrice.toFixed(2)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState('todos');
    const [sortBy, setSortBy] = useState('newest');

    const filteredProducts = activeCategory === 'todos'
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    return (
        <>
            <SEO
                title="Productos | Eguva - Ropa de Segunda Mano en Perú"
                description="Explora nuestro catálogo de ropa, zapatos y accesorios de segunda mano. Precios desde S/20. Calidad garantizada. Envíos a todo el Perú."
                keywords="comprar ropa usada peru, ropa segunda mano barata, zapatos usados lima, accesorios vintage peru"
            />
            <section className="pt-28 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="font-display text-4xl lg:text-5xl font-bold uppercase text-primary dark:text-white mb-4">
                            Nuestros Productos
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Encuentra prendas únicas seleccionadas con cariño. Cada pieza tiene su propia historia y está lista para ser parte de la tuya.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === cat.id
                                        ? 'bg-primary dark:bg-white text-white dark:text-primary'
                                        : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-icons text-sm">{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary dark:focus:ring-white cursor-pointer"
                        >
                            <option value="newest">Más recientes</option>
                            <option value="price-low">Precio: Menor a mayor</option>
                            <option value="price-high">Precio: Mayor a menor</option>
                        </select>
                    </div>

                    {/* Results Count */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Mostrando {sortedProducts.length} productos
                    </p>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Empty State */}
                    {sortedProducts.length === 0 && (
                        <div className="text-center py-20">
                            <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">inventory_2</span>
                            <p className="text-gray-500 dark:text-gray-400">No hay productos en esta categoría.</p>
                        </div>
                    )}

                    {/* WhatsApp CTA */}
                    <div className="mt-16 text-center bg-white dark:bg-card-dark rounded-2xl p-8 shadow-lg">
                        <span className="material-icons text-4xl text-green-500 mb-4">chat</span>
                        <h3 className="font-display text-xl font-bold text-primary dark:text-white mb-2">
                            ¿No encontraste lo que buscas?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                            Cuéntame qué necesitas y te ayudo a encontrarlo
                        </p>
                        <a
                            href="https://wa.me/51994845979?text=Hola!%20Estoy%20buscando%20un%20producto%20específico"
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
