import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
        metodoPago: 'MercadoPago'
    });

    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [showPaymentBrick, setShowPaymentBrick] = useState(false);

    const subtotal = cartTotal;
    const total = subtotal + shippingCost;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Función para inicializar el Brick de Pago de Mercado Pago
    const initPaymentBrick = useCallback(async (orderId) => {
        const mp = new window.MercadoPago('TEST-e6726f9e-33fa-46c6-becc-9babc810b3fe', {
            locale: 'es-PE'
        });
        const bricksBuilder = mp.bricks();

        const renderPaymentBrick = async (bricksBuilder) => {
            const settings = {
                initialization: {
                    amount: total, // monto total a pagar
                    preferenceId: null, // No es necesario si usamos payment bricks directamente
                    payer: {
                        email: user.correo,
                    },
                },
                customization: {
                    paymentMethods: {
                        ticket: ["all"],
                        bankTransfer: ["all"],
                        creditCard: "all",
                        debitCard: "all",
                        mercadoPago: "all",
                    },
                },
                callbacks: {
                    onReady: () => {
                        setLoading(false);
                    },
                    onSubmit: ({ selectedPaymentMethod, formData }) => {
                        return new Promise((resolve, reject) => {
                            const paymentData = {
                                payment: formData,
                                pedidoId: orderId
                            };

                            pagosAPI.procesarPago(paymentData)
                                .then((res) => {
                                    if (res.data.status === 'approved') {
                                        clearCart();
                                        navigate('/pago/exitoso?status=approved');
                                        resolve();
                                    } else if (res.data.status === 'in_process') {
                                        clearCart();
                                        navigate('/pago/pendiente?status=pending');
                                        resolve();
                                    } else {
                                        toast.error('El pago no pudo ser procesado. Intenta con otro medio.');
                                        reject();
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error al procesar pago:', error);
                                    toast.error('Error interno al procesar el pago');
                                    reject();
                                });
                        });
                    },
                    onError: (error) => {
                        console.error('Error en Brick:', error);
                        toast.error('Error al cargar la pasarela de pago');
                    },
                },
            };
            window.paymentBrickController = await bricksBuilder.create(
                'paymentBrick_container',
                'paymentBrick_container',
                settings
            );
        };

        renderPaymentBrick(bricksBuilder);
    }, [total, user.correo, clearCart, navigate, toast]);

    // Manejar el envío del formulario (Creación de Pedido)
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
            const newOrderId = response.data.id;
            setOrderId(newOrderId);

            if (form.metodoPago === 'MercadoPago') {
                setShowPaymentBrick(true);
                // La inicialización del brick se hace en un useEffect que mira showPaymentBrick
            } else {
                clearCart();
                navigate(`/perfil/pedidos/${newOrderId}`);
                toast.info('Pedido registrado. Por favor completa la transferencia bancaria.');
            }
        } catch (error) {
            console.error('Error al crear pedido:', error);
            toast.error(error.response?.data?.mensaje || 'Error al procesar el pedido');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showPaymentBrick && orderId) {
            initPaymentBrick(orderId);
        }
    }, [showPaymentBrick, orderId, initPaymentBrick]);

    if (cartItems.length === 0 && !showPaymentBrick) {
        navigate('/carrito');
        return null;
    }

    return (
        <>
            <SEO title="Finalizar Compra | Eguva" description="Completa tu pedido y recíbelo en la puerta de tu casa." />

            <section className="pt-32 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                        {/* Formulario / Pasarela */}
                        <div className="lg:col-span-3">
                            {!showPaymentBrick ? (
                                <>
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
                                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Pago Online (Tarjeta/Yape)</p>
                                                        <p className="text-[10px] text-gray-400">Procesado por Mercado Pago</p>
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

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-5 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                                        >
                                            {loading ? 'Procesando...' : `Confirmar y Pagar S/${total.toFixed(2)}`}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Completa tu pago</h2>
                                    <div id="paymentBrick_container"></div>
                                    <button
                                        onClick={() => setShowPaymentBrick(false)}
                                        className="mt-6 text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-icons text-sm">arrow_back</span>
                                        Cambiar datos de entrega
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Resumen Final */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 sticky top-32">
                                <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Resumen de Compra</h2>

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

                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                                    <span className="material-icons text-green-500">verified_user</span>
                                    <p className="text-[10px] text-gray-500 leading-tight">
                                        Pago 100% seguro. Tus datos están protegidos con encriptación de grado bancario.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
