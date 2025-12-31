import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, shippingCost, isFreeShipping, remainingForFreeShipping, freeShippingThreshold } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const subtotal = cartTotal;
    const shipping = shippingCost;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast.info('Para continuar con la compra, primero debes iniciar sesión.');
            navigate('/iniciar-sesión', { state: { from: '/carrito' } });
            return;
        }
        // Navegar a la página de checkout (que crearemos luego)
        toast.info('Módulo de pago en desarrollo. ¡Pronto disponible!');
    };

    return (
        <>
            <SEO
                title="Tu Carrito | Eguva"
                description="Revisa los productos en tu carrito y completa tu compra de moda sostenible."
            />

            <section className="pt-32 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-display text-4xl font-bold uppercase text-primary dark:text-white mb-10 tracking-tight">
                        Tu Carrito
                    </h1>

                    {cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-card-dark rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md"
                                    >
                                        <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-grow flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.nombre}</h3>
                                                    <p className="text-gray-500 text-sm capitalize">{item.categoria?.nombre || item.categoria}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    <span className="material-icons">delete_outline</span>
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-1 border border-gray-100 dark:border-gray-800">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-500 cursor-pointer"
                                                    >
                                                        <span className="material-icons text-sm">remove</span>
                                                    </button>
                                                    <span className="font-bold text-sm w-4 text-center dark:text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-500 cursor-pointer"
                                                    >
                                                        <span className="material-icons text-sm">add</span>
                                                    </button>
                                                </div>
                                                <p className="font-display font-bold text-xl text-primary dark:text-white">
                                                    S/{(item.precio * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 sticky top-32">
                                    <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Resumen de compra</h2>

                                    {/* Free Shipping Progress */}
                                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        {isFreeShipping ? (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                <span className="material-icons text-sm">check_circle</span>
                                                <span className="text-sm font-bold">¡Tienes envío gratis!</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Agrega <span className="font-bold text-primary dark:text-white">S/{remainingForFreeShipping.toFixed(2)}</span> más para obtener <span className="font-bold">envío gratis</span>.
                                                </p>
                                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>Subtotal</span>
                                            <span>S/{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                                            <span>Envío</span>
                                            {isFreeShipping ? (
                                                <span className="text-green-600 dark:text-green-400 font-bold uppercase text-xs">Gratis</span>
                                            ) : (
                                                <span>S/{shipping.toFixed(2)}</span>
                                            )}
                                        </div>
                                        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-2" />
                                        <div className="flex justify-between text-xl font-bold text-primary dark:text-white">
                                            <span>Total</span>
                                            <span>S/{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 dark:shadow-white/5"
                                    >
                                        Continuar al pago
                                        <span className="material-icons">arrow_forward</span>
                                    </button>

                                    <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
                                        <span className="material-icons text-lg">verified_user</span>
                                        <span className="text-xs">Pago 100% seguro y garantizado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-20 bg-white dark:bg-card-dark rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-4xl text-gray-300">shopping_cart</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tu carrito está vacío</h2>
                            <p className="text-gray-500 mb-8">¡Añade algunos tesoros para que empiecen su segunda vida!</p>
                            <Link
                                to="/productos"
                                className="inline-flex items-center gap-2 bg-primary dark:bg-white text-white dark:text-primary px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 cursor-pointer"
                            >
                                Explorar productos
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
