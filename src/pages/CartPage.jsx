import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const mockCartItems = [
    {
        id: 1,
        name: 'Chaqueta Denim Clásica',
        category: 'Ropa',
        price: 89.00,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop',
        quantity: 1,
    },
    {
        id: 2,
        name: 'Zapatillas Nike Air',
        category: 'Zapatos',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
        quantity: 1,
    }
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState(mockCartItems);

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 15.00;
    const total = subtotal + shipping;

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
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-grow flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                                                    <p className="text-gray-500 text-sm">{item.category}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    <span className="material-icons">delete_outline</span>
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-1 border border-gray-100 dark:border-gray-800">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-500 cursor-pointer"
                                                    >
                                                        <span className="material-icons text-sm">remove</span>
                                                    </button>
                                                    <span className="font-bold text-sm w-4 text-center dark:text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-500 cursor-pointer"
                                                    >
                                                        <span className="material-icons text-sm">add</span>
                                                    </button>
                                                </div>
                                                <p className="font-display font-bold text-xl text-primary dark:text-white">
                                                    S/{(item.price * item.quantity).toFixed(2)}
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

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>Subtotal</span>
                                            <span>S/{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>Envío</span>
                                            <span>S/{shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-2" />
                                        <div className="flex justify-between text-xl font-bold text-primary dark:text-white">
                                            <span>Total</span>
                                            <span>S/{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 dark:shadow-white/5">
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
