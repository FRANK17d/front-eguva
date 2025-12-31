import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';
import { pedidosAPI, pagosAPI } from '../services/api';

export default function CheckoutPage() {
    const { cartItems, cartTotal, shippingCost, isFreeShipping, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [form, setForm] = useState({
        direccionEnvio: '',
        ciudad: 'Lima',
        telefono: '',
        notas: '',
        metodoPago: 'MercadoPago' // Por defecto Mercado Pago (Tarjetas/Yape)
    });

    const [loading, setLoading] = useState(false);

    const subtotal = cartTotal;
    const total = subtotal + shippingCost;

    if (cartItems.length === 0) {
        navigate('/carrito');
        return null;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const pedidoData = {
                items: cartItems.map(item => ({
                    productoId: item.id,
                    cantidad: item.quantity
                })),
                ...form
            };

            const response = await pedidosAPI.crear(pedidoData);
            const pedidoId = response.data.id;

            toast.success('Pedido registrado correctamente');

            if (form.metodoPago === 'MercadoPago') {
                toast.info('Redirigiendo a la pasarela de pago...');
                const pagoRes = await pagosAPI.crearPreferencia(pedidoId);

                if (pagoRes.data.init_point) {
                    // Limpiar carrito antes de ir al pago
                    clearCart();
                    // Redirigir a Mercado Pago
                    window.location.href = pagoRes.data.init_point;
                } else {
                    throw new Error('No se pudo generar el enlace de pago');
                }
            } else {
                // Transferencia Directa
                clearCart();
                // Aquí podrías redirigir a una página de éxito específica para transferencia
                navigate(`/perfil/pedidos/${pedidoId}`);
                toast.info('Por favor, realiza la transferencia y envía el comprobante por WhatsApp.');
            }

        } catch (error) {
            console.error('Error al procesar checkout:', error);
            toast.error(error.response?.data?.mensaje || 'Error al procesar el pedido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO title="Finalizar Compra | Eguva" description="Completa tu pedido y recíbelo en la puerta de tu casa." />

            <section className="pt-32 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                        {/* Formulario de Envío */}
                        <div className="lg:col-span-3">
                            <h1 className="font-display text-3xl font-bold uppercase text-primary dark:text-white mb-8">
                                Detalles de Entrega
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                                            <input
                                                type="text"
                                                defaultValue={user?.nombre}
                                                readOnly
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white opacity-70"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dirección de Envío *</label>
                                            <input
                                                required
                                                name="direccionEnvio"
                                                value={form.direccionEnvio}
                                                onChange={handleChange}
                                                placeholder="Ej. Av. Larco 123, Int 402"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ciudad / Distrito *</label>
                                            <select
                                                name="ciudad"
                                                value={form.ciudad}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                            >
                                                <option value="Lima">Lima Metropolitana</option>
                                                <option value="Callao">Callao</option>
                                                <option value="Provincia">Otras Provincias</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Teléfono de Contacto *</label>
                                            <input
                                                required
                                                type="tel"
                                                name="telefono"
                                                value={form.telefono}
                                                onChange={handleChange}
                                                placeholder="999 999 999"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Referencia o Notas (Opcional)</label>
                                            <textarea
                                                name="notas"
                                                value={form.notas}
                                                onChange={handleChange}
                                                rows="2"
                                                placeholder="Ej. Tocar el timbre rojo, frente al parque..."
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="font-display text-2xl font-bold uppercase text-primary dark:text-white pt-4">
                                    Método de Pago
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`relative flex items-center p-4 cursor-pointer rounded-2xl border-2 transition-all ${form.metodoPago === 'MercadoPago' ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark'}`}>
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value="MercadoPago"
                                            checked={form.metodoPago === 'MercadoPago'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.metodoPago === 'MercadoPago' ? 'border-primary' : 'border-gray-300'}`}>
                                                {form.metodoPago === 'MercadoPago' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-sm">Mercado Pago</p>
                                                <p className="text-[10px] text-gray-400">Tarjetas, Yape, Efectivo</p>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`relative flex items-center p-4 cursor-pointer rounded-2xl border-2 transition-all ${form.metodoPago === 'Transferencia' ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark'}`}>
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value="Transferencia"
                                            checked={form.metodoPago === 'Transferencia'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.metodoPago === 'Transferencia' ? 'border-primary' : 'border-gray-300'}`}>
                                                {form.metodoPago === 'Transferencia' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-sm">Transferencia Directa</p>
                                                <p className="text-[10px] text-gray-400">Bancaria o Yape directo</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </form>
                        </div>

                        {/* Resumen Final */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 sticky top-32">
                                <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Tu Pedido</h2>

                                <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                                                <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.nombre}</h4>
                                                <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                                                <p className="text-sm font-bold text-primary dark:text-white mt-1">S/{(item.precio * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800 mb-8">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>S/{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Envío</span>
                                        {isFreeShipping ? (
                                            <span className="text-green-600 font-bold uppercase text-xs">Gratis</span>
                                        ) : (
                                            <span>S/{shippingCost.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-2" />
                                    <div className="flex justify-between text-2xl font-bold text-primary dark:text-white">
                                        <span>Total</span>
                                        <span>S/{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 dark:shadow-white/5 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    ) : (
                                        <>
                                            Pagar S/{total.toFixed(2)}
                                            <span className="material-icons">lock</span>
                                        </>
                                    )}
                                </button>

                                <p className="mt-6 text-[10px] text-center text-gray-400 px-4">
                                    Al hacer clic en "Pagar", aceptas nuestros Términos de Servicio y Políticas de Envío.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
