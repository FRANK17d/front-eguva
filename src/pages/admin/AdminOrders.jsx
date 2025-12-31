import { useState, useEffect } from 'react';
import { pedidosAPI } from '../../services/api';
import SEO from '../../components/SEO';
import { useToast } from '../../context/ToastContext';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const toast = useToast();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await pedidosAPI.getAdmin({ pagina: page, limite: 10 });
            setOrders(response.data.pedidos);
            setTotalPages(response.data.paginas);
            setTotalResults(response.data.total);
        } catch (err) {
            console.error('Error al cargar pedidos:', err);
            toast.error('No se pudieron cargar los pedidos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await pedidosAPI.actualizarEstado(orderId, newStatus);
            toast.success('Estado actualizado correctamente');
            fetchOrders();
        } catch (err) {
            toast.error('Error al actualizar el estado');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Entregado': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            case 'Pagado': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Enviado': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'Pendiente': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
            case 'Cancelado': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Gestión de Pedidos | Eguva Admin" description="Administra los pedidos de los clientes en Eguva." />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pedidos</h1>
                    <p className="text-gray-500 dark:text-gray-400">Controla y gestiona las ventas de tu tienda.</p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                            <tr>
                                <th className="px-6 py-4 text-left">Orden</th>
                                <th className="px-6 py-4 text-left">Cliente</th>
                                <th className="px-6 py-4 text-left">Fecha</th>
                                <th className="px-6 py-4 text-left">Total</th>
                                <th className="px-6 py-4 text-left">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-gray-900 dark:text-white">#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{order.usuario?.nombre}</span>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{order.ciudad}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white">
                                            S/ {parseFloat(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.estado}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest outline-none border-none cursor-pointer ${getStatusColor(order.estado)}`}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Pagado">Pagado</option>
                                                <option value="Enviado">Enviado</option>
                                                <option value="Entregado">Entregado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary rounded-lg transition-colors cursor-pointer">
                                                    <span className="material-icons text-sm">visibility</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-500">
                                        No se encontraron pedidos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-transparent">
                        <p className="text-xs text-gray-400">Página {page} de {totalPages}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
