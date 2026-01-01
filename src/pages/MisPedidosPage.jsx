import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pedidosAPI } from '../services/api';
import SEO from '../components/SEO';

export default function MisPedidosPage() {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados de paginación
    const [pagina, setPagina] = useState(1);
    const [paginas, setPaginas] = useState(1);
    const [total, setTotal] = useState(0);
    const [filtroEstado, setFiltroEstado] = useState('Todos');

    const estadosFiltro = [
        { id: 'Todos', label: 'Todos', icon: 'list' },
        { id: 'Pagado', label: 'Pagados', icon: 'check_circle' },
        { id: 'Enviado', label: 'Enviados', icon: 'local_shipping' },
        { id: 'Entregado', label: 'Entregados', icon: 'inventory_2' },
        { id: 'Cancelado', label: 'Cancelados', icon: 'cancel' }
    ];

    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            try {
                const response = await pedidosAPI.getMisPedidos({
                    pagina,
                    limite: 5,
                    estado: filtroEstado
                });
                setPedidos(response.data.pedidos);
                setPaginas(response.data.paginas);
                setTotal(response.data.total);
            } catch (err) {
                setError('Error al cargar tus pedidos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, [pagina, filtroEstado]);

    // Resetear a página 1 cuando cambia el filtro
    const handleFiltroChange = (nuevoEstado) => {
        setFiltroEstado(nuevoEstado);
        setPagina(1);
    };

    const getEstadoColor = (estado) => {
        const colores = {
            'Pendiente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Pagado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            'Enviado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'Entregado': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            'Rechazado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoIcono = (estado) => {
        const iconos = {
            'Pendiente': 'schedule',
            'Pagado': 'check_circle',
            'Enviado': 'local_shipping',
            'Entregado': 'inventory_2',
            'Cancelado': 'cancel',
            'Rechazado': 'error'
        };
        return iconos[estado] || 'help';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && pagina === 1 && pedidos.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center pt-32">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando tus pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Mis Pedidos | EGUVA"
                description="Revisa el estado de tus pedidos"
            />

            <div className="min-h-screen bg-gray-50 dark:bg-black pt-32 pb-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8 text-center md:text-left">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-4"
                        >
                            <span className="material-icons text-lg">arrow_back</span>
                            Volver a la tienda
                        </Link>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                            Mis Pedidos
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Hola, {user?.nombre}. Aquí puedes ver el historial de tus compras finalizadas.
                        </p>
                    </div>

                    {/* Tabs / Filtros */}
                    <div className="mb-8 overflow-x-auto no-scrollbar">
                        <div className="flex p-1 bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 min-w-max shadow-sm">
                            {estadosFiltro.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleFiltroChange(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${filtroEstado === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    <span className="material-icons text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {pedidos.length === 0 && !loading ? (
                        <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl p-16 text-center border border-gray-100 dark:border-gray-800 animate-fade-in">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-5xl text-gray-300 dark:text-gray-600">shopping_bag</span>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                                {filtroEstado === 'Todos'
                                    ? 'No tienes pedidos aún'
                                    : `No hay pedidos ${filtroEstado.toLowerCase()}s`}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                {filtroEstado === 'Todos'
                                    ? 'Explora nuestra tienda y encuentra los mejores productos para ti.'
                                    : `Actualmente no tienes ningún pedido en estado ${filtroEstado.toLowerCase()}.`}
                            </p>
                            <Link
                                to="/productos"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:scale-105"
                            >
                                <span className="material-icons">store</span>
                                Explorar Tienda
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {pedidos.map((pedido) => (
                                <div
                                    key={pedido.id}
                                    className="bg-white dark:bg-card-dark rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in"
                                >
                                    {/* Header del pedido */}
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">
                                                        Pedido
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md text-xs font-black text-gray-700 dark:text-gray-300">
                                                        #{pedido.id}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium italic">
                                                    Hecho el {formatDate(pedido.createdAt)}
                                                </p>
                                            </div>
                                            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black shadow-sm ${getEstadoColor(pedido.estado)}`}>
                                                <span className="material-icons text-xl">{getEstadoIcono(pedido.estado)}</span>
                                                {pedido.estado}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Productos del pedido */}
                                    <div className="p-6">
                                        {pedido.detalles && pedido.detalles.length > 0 ? (
                                            <div className="space-y-6 mb-8 mt-2">
                                                {pedido.detalles.slice(0, 3).map((detalle, idx) => (
                                                    <div key={idx} className="flex items-center gap-5">
                                                        {(detalle.producto?.imagen || detalle.producto?.imagenes?.[0]) ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={detalle.producto.imagen || detalle.producto.imagenes[0]}
                                                                    alt={detalle.producto?.nombre}
                                                                    className="w-20 h-20 object-cover rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md group-hover:scale-105 transition-transform"
                                                                />
                                                                <span className="absolute -top-2 -right-2 bg-primary text-white w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black shadow-lg">
                                                                    {detalle.cantidad}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800">
                                                                <span className="material-icons text-gray-400">image</span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-black text-gray-900 dark:text-white truncate text-lg">
                                                                {detalle.producto?.nombre || 'Producto'}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                                Precio unitario: S/{Number(detalle.precio).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-gray-900 dark:text-white text-lg">
                                                                S/{(detalle.cantidad * detalle.precio).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {pedido.detalles.length > 3 && (
                                                    <div className="flex items-center gap-2 pl-24 text-primary dark:text-white font-black text-sm uppercase tracking-wider cursor-default">
                                                        <span className="material-icons text-base">add_circle</span>
                                                        Ver {pedido.detalles.length - 3} productos más
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                                                {pedido.detalles?.length || 0} producto(s)
                                            </p>
                                        )}

                                        {/* Información de envío */}
                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 mb-8 border border-gray-100 dark:border-gray-800 shadow-inner">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                                                    <span className="material-icons text-primary text-lg">local_shipping</span>
                                                </div>
                                                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                    Detalles de la Entrega (Agencia)
                                                </p>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6 text-sm">
                                                <div className="space-y-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-black mb-0.5 tracking-tighter">Destinatario / DNI</span>
                                                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                            {pedido.nombreCompleto || user?.nombre}
                                                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md text-[10px] uppercase">
                                                                DNI: {pedido.dni || 'N/A'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-black mb-0.5 tracking-tighter">Contacto</span>
                                                        <span className="font-bold text-gray-900 dark:text-white">{pedido.telefono}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-black mb-0.5 tracking-tighter">Destino Final</span>
                                                        <span className="font-bold text-gray-900 dark:text-white">{pedido.distrito || pedido.provincia}, {pedido.departamento}</span>
                                                    </div>
                                                    {pedido.notas && (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-black mb-0.5 tracking-tighter">Preferencia de Agencia</span>
                                                            <span className="font-bold text-primary dark:text-white italic bg-primary/5 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-primary/10 dark:border-white/10 w-fit">
                                                                "{pedido.notas}"
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="flex flex-wrap items-end justify-between gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4 text-sm font-bold">
                                                    <span className="text-gray-400">Subtotal</span>
                                                    <span className="text-gray-900 dark:text-white">S/{Number(pedido.subtotal || 0).toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm font-bold">
                                                    <span className="text-gray-400">Costo Envío</span>
                                                    <span className={Number(pedido.costoEnvio) === 0 ? "text-green-500 font-black tracking-widest uppercase text-xs" : "text-gray-900 dark:text-white"}>
                                                        {Number(pedido.costoEnvio) === 0 ? 'Gratis' : `S/${Number(pedido.costoEnvio).toFixed(2)}`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Monto Total Pagado</p>
                                                <div className="flex items-baseline justify-end gap-1">
                                                    <span className="text-sm font-black text-primary">S/</span>
                                                    <p className="text-4xl font-black text-gray-900 dark:text-white">
                                                        {Number(pedido.total).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Paginación */}
                            {paginas > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-12 bg-white dark:bg-card-dark p-5 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in text-gray-800 dark:text-gray-200">
                                    <button
                                        onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                                        disabled={pagina === 1 || loading}
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        <span className="material-icons">chevron_left</span>
                                    </button>

                                    <div className="flex gap-2">
                                        {[...Array(paginas)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setPagina(i + 1)}
                                                className={`w-12 h-12 rounded-2xl font-black transition-all ${pagina === i + 1
                                                    ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-110'
                                                    : 'bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPagina(prev => Math.min(prev + 1, paginas))}
                                        disabled={pagina === paginas || loading}
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        <span className="material-icons">chevron_right</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
