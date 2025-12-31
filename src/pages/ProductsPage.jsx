import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { productosAPI, categoriasAPI } from '../services/api';
import SEO from '../components/SEO';

const conditionColors = {
    'Excelente': 'bg-green-500',
    'Muy Bueno': 'bg-blue-500',
    'Bueno': 'bg-yellow-500',
    'Regular': 'bg-orange-500',
};

function ProductCard({ product }) {
    const discount = product.precioOriginal
        ? Math.round((1 - product.precio / product.precioOriginal) * 100)
        : 0;

    return (
        <Link to={`/producto/${product.id}`} className="block group">
            <div className="bg-white dark:bg-card-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover-card">
                <div className="relative overflow-hidden aspect-[4/5]">
                    {product.imagen ? (
                        <img
                            src={product.imagen}
                            alt={product.nombre}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="material-icons text-4xl text-gray-300">image</span>
                        </div>
                    )}

                    {/* Condition Badge */}
                    <div className={`absolute top-3 left-3 ${conditionColors[product.condicion] || 'bg-gray-500'} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                        {product.condicion}
                    </div>

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{discount}%
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // TODO: Add to cart logic
                            }}
                            className="flex-1 bg-primary dark:bg-white text-white dark:text-primary py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                            aria-label="Añadir al carrito"
                        >
                            <span className="material-icons text-sm">add_shopping_cart</span>
                            Añadir
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // TODO: Add to wishlist logic
                            }}
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
                        {product.nombre}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm mt-1 capitalize">
                        {product.categoria?.nombre || product.categoria}
                    </p>

                    {/* Price in Soles */}
                    <div className="mt-3 flex items-center gap-2">
                        <p className={`font-display font-bold text-lg ${discount > 0 ? 'text-red-600' : 'text-primary dark:text-white'}`}>
                            S/{parseFloat(product.precio).toFixed(2)}
                        </p>
                        {product.precioOriginal && (
                            <p className="text-sm text-gray-400 line-through">
                                S/{parseFloat(product.precioOriginal).toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function ProductsPage() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('');
    const [sortBy, setSortBy] = useState('recientes');
    const [total, setTotal] = useState(0);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const location = useLocation();

    // Cargar categorías y setear categoría activa de la URL
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await categoriasAPI.getAll();
                setCategorias(response.data);

                // Obtener ID de categoría de la URL o limpiar si no existe
                const params = new URLSearchParams(location.search);
                const queryCat = params.get('categoria');
                setActiveCategory(queryCat || '');
                setPagina(1); // Resetear a página 1 al cambiar categoría por URL
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            }
        };
        fetchCategorias();
    }, [location.search]);

    // Cargar productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const params = {
                    orden: sortBy,
                    limite: 12, // Cargamos 12 productos por página
                    pagina: pagina
                };
                if (activeCategory) params.categoria = activeCategory;

                const response = await productosAPI.getAll(params);
                setProductos(response.data.productos);
                setTotal(response.data.total);
                setTotalPaginas(response.data.totalPaginas);
            } catch (err) {
                console.error('Error al cargar productos:', err);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, [activeCategory, sortBy, pagina]);

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
                            <button
                                onClick={() => setActiveCategory('')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === ''
                                    ? 'bg-primary dark:bg-white text-white dark:text-primary'
                                    : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <span className="material-icons text-sm">grid_view</span>
                                Todos
                            </button>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id.toString())}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === cat.id.toString()
                                        ? 'bg-primary dark:bg-white text-white dark:text-primary'
                                        : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-icons text-sm">{cat.icono || 'category'}</span>
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary dark:focus:ring-white cursor-pointer"
                        >
                            <option value="recientes">Más recientes</option>
                            <option value="precio-asc">Precio: Menor a mayor</option>
                            <option value="precio-desc">Precio: Mayor a menor</option>
                            <option value="nombre">Nombre A-Z</option>
                        </select>
                    </div>

                    {/* Results Count */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Mostrando {productos.length} de {total} productos
                    </p>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500">Cargando productos...</p>
                        </div>
                    ) : productos.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {productos.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination Buttons */}
                            {totalPaginas > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setPagina(p => Math.max(1, p - 1));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={pagina === 1}
                                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        <span className="material-icons">chevron_left</span>
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPaginas)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => {
                                                    setPagina(i + 1);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 rounded-full text-sm font-bold transition-all cursor-pointer ${pagina === i + 1
                                                    ? 'bg-primary dark:bg-white text-white dark:text-primary shadow-lg'
                                                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setPagina(p => Math.min(totalPaginas, p + 1));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={pagina === totalPaginas}
                                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        <span className="material-icons">chevron_right</span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
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
            </section >
        </>
    );
}
