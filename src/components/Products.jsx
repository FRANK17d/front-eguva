import { Link } from 'react-router-dom';

const products = [
    {
        id: 1,
        name: 'Chaqueta Denim Clásica',
        category: 'Ropa',
        condition: 'Excelente',
        price: 89.00,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop',
    },
    {
        id: 2,
        name: 'Zapatillas Nike Air',
        category: 'Zapatos',
        condition: 'Muy Bueno',
        price: 120.00,
        originalPrice: 180.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    },
    {
        id: 3,
        name: 'Camisa a Cuadros',
        category: 'Ropa',
        condition: 'Excelente',
        price: 35.00,
        originalPrice: 45.00,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    },
    {
        id: 4,
        name: 'Bolso de Cuero Vintage',
        category: 'Accesorios',
        condition: 'Bueno',
        price: 65.00,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop',
    },
];

function ProductCard({ product }) {
    const conditionColor = {
        'Excelente': 'bg-green-500',
        'Muy Bueno': 'bg-blue-500',
        'Bueno': 'bg-yellow-500',
    };

    return (
        <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-gray-100 mb-4">
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

                {/* Add to Cart Button */}
                <button
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100 cursor-pointer"
                    aria-label={`Añadir ${product.name} al carrito`}
                >
                    <span className="material-icons text-sm text-black">add_shopping_cart</span>
                </button>
            </div>

            {/* Product Info */}
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {product.name}
            </h3>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
                {product.category}
            </p>

            {/* Price in Soles */}
            {product.originalPrice ? (
                <div className="flex items-center gap-2 mt-2">
                    <p className="font-display font-bold text-lg text-red-600">S/{product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-400 line-through">S/{product.originalPrice.toFixed(2)}</p>
                </div>
            ) : (
                <p className="font-display font-bold text-lg mt-2 text-primary dark:text-white">
                    S/{product.price.toFixed(2)}
                </p>
            )}
        </div>
    );
}

export default function Products() {
    return (
        <section id="productos" className="py-20 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-display text-3xl font-bold uppercase text-primary dark:text-white mb-2 border-l-4 border-primary dark:border-white pl-4">
                            Recién Llegados
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 pl-5">
                            Los últimos tesoros que llegaron a la tienda.
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

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
