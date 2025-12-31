import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productosAPI } from '../services/api';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const conditionStyles = {
    'Excelente': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
    'Muy Bueno': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
    'Bueno': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
    'Regular': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartItems } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();
    const toast = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await productosAPI.getById(id);
                setProduct(response.data);
            } catch (err) {
                console.error('Error al cargar producto:', err);
                setError('Producto no encontrado');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        const success = addToCart(product, quantity);
        if (success) {
            setAddedToCart(true);
            toast.success(`${product.nombre} añadido al carrito`);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleAddToWishlist = () => {
        toggleWishlist(product);
        if (!isInWishlist(product.id)) {
            toast.success('Añadido a favoritos');
        }
    };

    const handleBuyNow = () => {
        const success = addToCart(product, quantity);
        if (!success) return;

        if (!isAuthenticated) {
            toast.info('Para continuar con la compra, primero debes iniciar sesión.');
            navigate('/iniciar-sesión', { state: { from: '/carrito' } });
            return;
        }
        navigate('/carrito');
    };

    const handleWhatsApp = () => {
        const message = `Hola! Me interesa este producto: ${product.nombre} - S/${product.precio}`;
        window.open(`https://wa.me/51994845979?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-28 pb-20 bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-primary dark:text-white mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen pt-28 pb-20 bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">error_outline</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Producto no encontrado</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">El producto que buscas no existe o fue eliminado.</p>
                    <Link
                        to="/productos"
                        className="inline-flex items-center gap-2 bg-primary dark:bg-white text-white dark:text-primary px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        <span className="material-icons">arrow_back</span>
                        Ver todos los productos
                    </Link>
                </div>
            </div>
        );
    }

    // Manejar imagenes que puede ser string JSON, array o undefined
    let imagenesArray = [];
    if (product.imagenes) {
        if (typeof product.imagenes === 'string') {
            try {
                imagenesArray = JSON.parse(product.imagenes);
            } catch {
                imagenesArray = [];
            }
        } else if (Array.isArray(product.imagenes)) {
            imagenesArray = product.imagenes;
        }
    }
    const images = imagenesArray.length > 0 ? imagenesArray : (product.imagen ? [product.imagen] : []);
    const discount = product.precioOriginal ? Math.round((1 - product.precio / product.precioOriginal) * 100) : 0;
    const conditionStyle = conditionStyles[product.condicion] || conditionStyles['Bueno'];
    const categoryName = product.categoria?.nombre || 'Sin categoría';

    return (
        <>
            <SEO
                title={`${product.nombre} | Eguva`}
                description={product.descripcion?.substring(0, 160) || `Compra ${product.nombre} en Eguva. ${product.condicion}. Precio: S/${product.precio}`}
                keywords={`${product.nombre}, ${categoryName}, ropa segunda mano peru, moda sostenible`}
            />

            <section className="pt-28 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                        <Link to="/" className="hover:text-primary dark:hover:text-white transition-colors">Inicio</Link>
                        <span className="material-icons text-xs">chevron_right</span>
                        <Link to="/productos" className="hover:text-primary dark:hover:text-white transition-colors">Productos</Link>
                        <span className="material-icons text-xs">chevron_right</span>
                        <span className="text-gray-900 dark:text-white">{product.nombre}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {images.length > 0 ? (
                                    <img
                                        src={images[selectedImage]}
                                        alt={product.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-icons text-6xl text-gray-300">image</span>
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {discount > 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                        -{discount}%
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors cursor-pointer"
                                        >
                                            <span className="material-icons text-gray-800 dark:text-white">chevron_left</span>
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors cursor-pointer"
                                        >
                                            <span className="material-icons text-gray-800 dark:text-white">chevron_right</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === index
                                                ? 'border-primary dark:border-white'
                                                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <img src={img} alt={`${product.nombre} ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
                            {/* Condition Badge */}
                            <div className={`inline-flex items-center gap-2 ${conditionStyle.bg} ${conditionStyle.text} px-3 py-1.5 rounded-full text-sm font-medium`}>
                                <span className={`w-2 h-2 rounded-full ${conditionStyle.dot}`}></span>
                                {product.condicion}
                            </div>

                            {/* Title */}
                            <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary dark:text-white uppercase tracking-wide">
                                {product.nombre}
                            </h1>

                            {/* Category */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="material-icons text-sm">category</span>
                                <span className="capitalize">{categoryName}</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="font-display text-4xl font-bold text-primary dark:text-white">
                                    S/{parseFloat(product.precio).toFixed(2)}
                                </span>
                                {product.precioOriginal && (
                                    <span className="text-xl text-gray-400 line-through">
                                        S/{parseFloat(product.precioOriginal).toFixed(2)}
                                    </span>
                                )}
                                {discount > 0 && (
                                    <span className="text-sm font-bold text-red-500">
                                        Ahorras S/{(product.precioOriginal - product.precio).toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Size & Stock */}
                            <div className="flex flex-wrap gap-4">
                                {product.talla && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Talla:</span>
                                        <span className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-900 dark:text-white">
                                            {product.talla}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Stock:</span>
                                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {product.stock > 0 ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : 'Agotado'}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {product.descripcion && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descripción</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {product.descripcion}
                                    </p>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            {product.stock > 1 && (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Cantidad:</span>
                                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
                                        >
                                            <span className="material-icons">remove</span>
                                        </button>
                                        <span className="w-12 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
                                        >
                                            <span className="material-icons">add</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 py-4 px-6 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${addedToCart
                                        ? 'bg-green-500 text-white'
                                        : 'bg-primary dark:bg-white text-white dark:text-primary hover:opacity-90'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <span className="material-icons text-xl">
                                        {addedToCart ? 'check' : 'add_shopping_cart'}
                                    </span>
                                    {addedToCart ? '¡Añadido!' : 'Añadir al carrito'}
                                </button>
                                <button
                                    onClick={handleAddToWishlist}
                                    className={`w-14 h-14 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${isInWishlist(product.id)
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500 hover:border-red-200'
                                        }`}
                                >
                                    <span className="material-icons">
                                        {isInWishlist(product.id) ? 'favorite' : 'favorite_border'}
                                    </span>
                                </button>
                            </div>

                            {/* Buy Now & WhatsApp */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.stock === 0}
                                    className="flex-1 py-4 px-6 border-2 border-primary dark:border-white text-primary dark:text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Comprar ahora
                                </button>
                                <button
                                    onClick={handleWhatsApp}
                                    className="flex-1 py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Consultar
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-center">
                                    <span className="material-icons text-2xl text-primary dark:text-white mb-1">verified_user</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Calidad<br />Garantizada</p>
                                </div>
                                <div className="text-center">
                                    <span className="material-icons text-2xl text-primary dark:text-white mb-1">local_shipping</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Envío a<br />todo Perú</p>
                                </div>
                                <div className="text-center">
                                    <span className="material-icons text-2xl text-primary dark:text-white mb-1">support_agent</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Soporte<br />24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Products */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <Link
                            to="/productos"
                            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                        >
                            <span className="material-icons">arrow_back</span>
                            Volver a productos
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
