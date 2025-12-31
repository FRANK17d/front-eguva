import { useState, useEffect, useCallback } from 'react';
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

    // Estados del flujo
    const [step, setStep] = useState(1); // 1: Envío, 2: Pago
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [paymentType, setPaymentType] = useState('card');
    const [yapeForm, setYapeForm] = useState({ phoneNumber: '', otp: '' });
    const [processingYape, setProcessingYape] = useState(false);

    // Formulario de envío
    const [form, setForm] = useState({
        direccionEnvio: '',
        ciudad: 'Trujillo',
        telefono: '',
        notas: ''
    });

    const subtotal = cartTotal;
    const total = subtotal + shippingCost;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Inicializar Payment Brick
    const initPaymentBrick = useCallback(async (orderId) => {
        const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
        if (!publicKey) {
            toast.error('Error de configuración de pago');
            setLoading(false);
            return;
        }

        // Detectar si está en modo oscuro
        const isDark = document.documentElement.classList.contains('dark');

        const mp = new window.MercadoPago(publicKey, { locale: 'es-PE' });
        const bricksBuilder = mp.bricks();

        const settings = {
            initialization: {
                amount: total,
                payer: { email: user.correo, entityType: 'individual' },
            },
            customization: {
                visual: {
                    style: {
                        theme: isDark ? 'dark' : 'default',
                        customVariables: isDark ? {
                            textPrimaryColor: '#ffffff',
                            textSecondaryColor: '#a0a0a0',
                            inputBackgroundColor: '#1f1f3d',
                            formBackgroundColor: 'transparent'
                        } : {
                            formBackgroundColor: 'transparent'
                        }
                    },
                    hideFormTitle: true
                },
                paymentMethods: {
                    creditCard: 'all',
                    debitCard: 'all',
                },
            },
            callbacks: {
                onReady: () => setLoading(false),
                onSubmit: ({ formData }) => {
                    return pagosAPI.procesarPago({ payment: formData, pedidoId: orderId })
                        .then((res) => {
                            if (res.data.status === 'approved') {
                                clearCart();
                                navigate('/pago/exitoso?status=approved');
                            } else if (res.data.status === 'in_process') {
                                clearCart();
                                navigate('/pago/pendiente?status=pending');
                            } else {
                                toast.error(res.data.mensaje || 'Pago rechazado');
                            }
                        })
                        .catch((error) => {
                            toast.error(error.response?.data?.detalles || 'Error al procesar');
                        });
                },
                onError: () => toast.error('Error en la pasarela de pago'),
            },
        };

        const checkContainer = () => {
            const container = document.getElementById('paymentBrick_container');
            if (container) {
                bricksBuilder.create('payment', 'paymentBrick_container', settings)
                    .then(controller => { window.paymentBrickController = controller; })
                    .catch(console.error);
            } else {
                setTimeout(checkContainer, 100);
            }
        };
        checkContainer();
    }, [total, user.correo, clearCart, navigate, toast]);

    // Procesar pago con Yape
    const handleYapePayment = async () => {
        if (!yapeForm.phoneNumber || yapeForm.otp.length !== 6) {
            toast.error('Ingresa tu número de 9 dígitos y código de 6 dígitos');
            return;
        }

        if (yapeForm.phoneNumber.length !== 9) {
            toast.error('El número debe tener exactamente 9 dígitos');
            return;
        }

        setProcessingYape(true);
        try {
            const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, { locale: 'es-PE' });

            // Crear token de Yape
            const yape = mp.yape({
                otp: yapeForm.otp,
                phoneNumber: yapeForm.phoneNumber
            });

            let yapeToken;
            try {
                yapeToken = await yape.create();
            } catch (tokenError) {
                console.error('Error al crear token Yape:', tokenError);
                toast.error('Error al validar con Yape. Verifica tu número y código de aprobación.');
                setProcessingYape(false);
                return;
            }

            if (!yapeToken?.id) {
                toast.error('No se pudo generar el token de Yape');
                setProcessingYape(false);
                return;
            }

            const res = await pagosAPI.procesarPago({
                payment: {
                    token: yapeToken.id,
                    transaction_amount: parseFloat(total.toFixed(2)),
                    installments: 1,
                    payment_method_id: 'yape',
                    payer: { email: user.correo }
                },
                pedidoId: orderId
            });

            if (res.data.status === 'approved') {
                clearCart();
                navigate('/pago/exitoso?status=approved');
            } else {
                toast.error(res.data.mensaje || res.data.status_detail || 'Pago rechazado');
            }
        } catch (error) {
            console.error('Error procesando pago Yape:', error);
            const errorMsg = error.response?.data?.detalles || error.response?.data?.error || 'Error al procesar el pago';
            toast.error(errorMsg);
        } finally {
            setProcessingYape(false);
        }
    };

    // Crear pedido y pasar al paso 2
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const pedidoData = {
                items: cartItems.map(item => ({ productoId: item.id, cantidad: item.quantity })),
                metodoPago: 'MercadoPago',
                ...form
            };

            const response = await pedidosAPI.crear(pedidoData);
            setOrderId(response.data.id);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'Error al crear pedido');
            setLoading(false);
        }
    };

    // Inicializar Brick cuando estamos en paso 2 y paymentType es card
    useEffect(() => {
        if (step === 2 && orderId && paymentType === 'card') {
            const timer = setTimeout(() => initPaymentBrick(orderId), 400);
            return () => {
                clearTimeout(timer);
                // Destruir el Brick al cambiar de método
                if (window.paymentBrickController) {
                    try {
                        window.paymentBrickController.unmount();
                    } catch (e) { /* ignore */ }
                    window.paymentBrickController = null;
                }
            };
        }
    }, [step, orderId, paymentType, initPaymentBrick]);

    // Redirigir si no hay items
    if (cartItems.length === 0 && step === 1) {
        navigate('/carrito');
        return null;
    }

    return (
        <>
            <SEO title="Checkout | Eguva" description="Finaliza tu compra de forma segura" />

            <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 pt-24 pb-12">
                <div className="max-w-6xl mx-auto px-4">

                    {/* Header con progreso */}
                    <div className="mb-8">
                        <Link to="/carrito" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4 transition-colors">
                            <span className="material-icons text-lg">arrow_back</span>
                            Volver al carrito
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary dark:text-white">
                            {step === 1 ? 'Datos de Envío' : 'Método de Pago'}
                        </h1>

                        {/* Indicador de pasos */}
                        <div className="flex items-center gap-4 mt-6">
                            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary dark:text-white' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>1</div>
                                <span className="text-sm font-medium hidden sm:block">Envío</span>
                            </div>
                            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
                            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary dark:text-white' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>2</div>
                                <span className="text-sm font-medium hidden sm:block">Pago</span>
                            </div>
                        </div>
                    </div>


                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* Panel Principal - Formulario */}
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/20 dark:border-white/10">

                                {step === 1 ? (
                                    /* PASO 1: Formulario de Envío */
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                    <span className="material-icons text-sm align-middle mr-1">person</span>
                                                    Nombre
                                                </label>
                                                <input
                                                    type="text"
                                                    value={user?.nombre || ''}
                                                    readOnly
                                                    className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-900/50 rounded-xl text-gray-600 dark:text-gray-400 cursor-not-allowed"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                    <span className="material-icons text-sm align-middle mr-1">home</span>
                                                    Dirección de Envío *
                                                </label>
                                                <input
                                                    required
                                                    name="direccionEnvio"
                                                    value={form.direccionEnvio}
                                                    onChange={handleChange}
                                                    placeholder="Av. Ejemplo 123, Dpto 4B"
                                                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                    <span className="material-icons text-sm align-middle mr-1">location_city</span>
                                                    Ciudad
                                                </label>
                                                <select
                                                    name="ciudad"
                                                    value={form.ciudad}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:text-white cursor-pointer"
                                                >
                                                    <option value="Trujillo">Trujillo (La Libertad)</option>
                                                    <option value="Lima">Lima</option>
                                                    <option value="Arequipa">Arequipa</option>
                                                    <option value="Chiclayo">Chiclayo</option>
                                                    <option value="Piura">Piura</option>
                                                    <option value="Cusco">Cusco</option>
                                                    <option value="Ica">Ica</option>
                                                    <option value="Huancayo">Huancayo</option>
                                                    <option value="Tacna">Tacna</option>
                                                    <option value="Otra">Otra ciudad</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                    <span className="material-icons text-sm align-middle mr-1">phone</span>
                                                    Teléfono *
                                                </label>
                                                <input
                                                    required
                                                    type="tel"
                                                    name="telefono"
                                                    value={form.telefono}
                                                    onChange={handleChange}
                                                    placeholder="999 999 999"
                                                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:text-white"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                    <span className="material-icons text-sm align-middle mr-1">notes</span>
                                                    Notas (opcional)
                                                </label>
                                                <textarea
                                                    name="notas"
                                                    value={form.notas}
                                                    onChange={handleChange}
                                                    rows="2"
                                                    placeholder="Instrucciones especiales de entrega..."
                                                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none dark:text-white resize-none"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 mt-4 bg-gradient-to-r from-primary to-primary/80 dark:from-white dark:to-gray-200 text-white dark:text-primary font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                                        >
                                            {loading ? (
                                                <span className="animate-spin material-icons">refresh</span>
                                            ) : (
                                                <>
                                                    Continuar al Pago
                                                    <span className="material-icons">arrow_forward</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    /* PASO 2: Métodos de Pago */
                                    <div className="space-y-6">
                                        {/* Selector Tarjeta / Yape */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentType('card')}
                                                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${paymentType === 'card'
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                                                    }`}
                                            >
                                                {paymentType === 'card' && (
                                                    <span className="absolute top-2 right-2 material-icons text-primary text-lg">check_circle</span>
                                                )}
                                                <span className="material-icons text-3xl text-gray-700 dark:text-gray-300">credit_card</span>
                                                <span className="font-bold text-sm text-gray-900 dark:text-white">Tarjeta</span>
                                                <span className="text-[10px] text-gray-500">Crédito o Débito</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setPaymentType('yape')}
                                                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${paymentType === 'yape'
                                                    ? 'border-[#742284] bg-[#742284]/5 dark:bg-[#742284]/10'
                                                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                                                    }`}
                                            >
                                                {paymentType === 'yape' && (
                                                    <span className="absolute top-2 right-2 material-icons text-[#742284] text-lg">check_circle</span>
                                                )}
                                                <img src="/yape-logo.png" alt="Yape" className="w-10 h-10 rounded-xl" />
                                                <span className="font-bold text-sm text-gray-900 dark:text-white">Yape</span>
                                                <span className="text-[10px] text-gray-500">Pago rápido</span>
                                            </button>
                                        </div>

                                        {/* Contenido según método */}
                                        {paymentType === 'card' ? (
                                            <div className="min-h-[300px]" key={`brick-wrapper-${orderId}`}>
                                                <div id="paymentBrick_container" key={`brick-${orderId}`}></div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4" key="yape-form">
                                                <p className="text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl">
                                                    Ve a tu Yape, entra en "Aprobar compras" y copia el código de aprobación.
                                                </p>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Número de Celular</label>
                                                    <input
                                                        type="tel"
                                                        value={yapeForm.phoneNumber}
                                                        onChange={(e) => setYapeForm({ ...yapeForm, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                                                        placeholder="999 999 999"
                                                        className="w-full px-4 py-4 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xl tracking-widest focus:ring-2 focus:ring-[#742284]/50 outline-none dark:text-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Código de Aprobación</label>
                                                    <input
                                                        type="text"
                                                        value={yapeForm.otp}
                                                        onChange={(e) => setYapeForm({ ...yapeForm, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                                        placeholder="• • • • • •"
                                                        className="w-full px-4 py-4 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl text-3xl tracking-[0.5em] text-center font-mono focus:ring-2 focus:ring-[#742284]/50 outline-none dark:text-white"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={handleYapePayment}
                                                    disabled={processingYape || yapeForm.otp.length !== 6 || yapeForm.phoneNumber.length !== 9}
                                                    className="w-full py-4 bg-gradient-to-r from-[#742284] to-purple-600 text-white font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    {processingYape ? (
                                                        <>
                                                            <span className="animate-spin material-icons">refresh</span>
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-icons">check_circle</span>
                                                            Pagar S/{total.toFixed(2)}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Botón volver */}
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer"
                                        >
                                            <span className="material-icons text-lg">arrow_back</span>
                                            Editar datos de envío
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel Resumen */}
                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-white/10 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-icons text-primary">shopping_bag</span>
                                    Tu pedido
                                </h3>

                                {/* Lista de productos */}
                                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.nombre}</p>
                                                <p className="text-xs text-gray-500">x{item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">S/{(item.precio * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>S/{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Envío</span>
                                        {isFreeShipping ? (
                                            <span className="text-green-500 font-bold">GRATIS</span>
                                        ) : (
                                            <span>S/{shippingCost.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-primary dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <span>Total</span>
                                        <span>S/{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Badge de seguridad */}
                                <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center gap-3">
                                    <span className="material-icons text-green-500 text-2xl">lock</span>
                                    <div>
                                        <p className="text-xs font-bold text-green-700 dark:text-green-400">Pago 100% Seguro</p>
                                        <p className="text-[10px] text-green-600 dark:text-green-500">Encriptación SSL</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}
