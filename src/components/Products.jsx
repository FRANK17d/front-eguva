import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productosAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const conditionColors = {
    'Excelente': 'bg-green-500',
    'Muy Bueno': 'bg-blue-500',
    'Bueno': 'bg-yellow-500',
    'Regular': 'bg-orange-500',
};

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const toast = useToast();

    const discount = product.precioOriginal
        ? Math.round((1 - product.precio / product.precioOriginal) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast.success(`${product.nombre} añadido al carrito`);
    };

    return (
        <Link to={`/producto/${product.id}`} className="group cursor-pointer block">
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                {product.imagen ? (
                    <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                        <span className="material-icons text-4xl text-gray-400">image</span>
                    </div>
                )}

                {/* Condition Badge */}
                <div className={`absolute top-3 left-3 ${conditionColors[product.condicion] || 'bg-gray-500'} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
                    {product.condicion}
                </div>

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        -{discount}%
                    </div>
                )}

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-4 right-4 bg-white dark:bg-card-dark p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label={`Añadir ${product.nombre} al carrito`}
                >
                    <span className="material-icons text-xl text-primary dark:text-white">add_shopping_cart</span>
                </button>
            </div>

            {/* Product Info */}
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-1">
                {product.nombre}
            </h3>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
                {product.categoria?.nombre || 'Sin categoría'}
            </p>

            {/* Price in Soles */}
            <div className="flex items-center gap-2 mt-2">
                <p className={`font-display font-bold text-lg ${discount > 0 ? 'text-red-600' : 'text-primary dark:text-white'}`}>
                    S/{parseFloat(product.precio).toFixed(2)}
                </p>
                {product.precioOriginal && (
                    <p className="text-sm text-gray-400 line-through">
                        S/{parseFloat(product.precioOriginal).toFixed(2)}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default function Products() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await productosAPI.getDestacados(4);
                setProductos(response.data);
            } catch (err) {
                console.error('Error al cargar productos destacados:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    return (
        <section id="productos" className="py-20 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-display text-3xl font-bold uppercase text-primary dark:text-white mb-2 border-l-4 border-primary dark:border-white pl-4">
                            Productos Destacados
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 pl-5">
                            Piezas únicas seleccionadas especialmente para ti.
                        </p>
                    </div>
                    <Link
                        to="/productos"
                        className="hidden sm:flex items-center text-sm font-bold uppercase tracking-wider text-primary dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        Ver todos
                        <span className="material-icons text-sm ml-2">arrow_forward</span>
                    </Link>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                ) : productos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                        {productos.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <span className="material-icons text-4xl text-gray-300 dark:text-gray-600 mb-2">inventory_2</span>
                        <p className="text-gray-500 dark:text-gray-400">No hay productos destacados.</p>
                    </div>
                )}

                {/* Mobile CTA */}
                <div className="text-center mt-10 sm:hidden">
                    <Link
                        to="/productos"
                        className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-primary dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        Ver todos los productos
                        <span className="material-icons text-sm ml-2">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
