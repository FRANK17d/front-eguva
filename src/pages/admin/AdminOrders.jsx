import { useState } from 'react';
import SEO from '../../components/SEO';

const initialOrders = [
    { id: '#1205', customer: 'Juan Perez', date: '30/12/2025', total: 145.00, status: 'Pendiente', items: 2, shipping: 'Olva Courier' },
    { id: '#1204', customer: 'Maria Garcia', date: '30/12/2025', total: 89.00, status: 'Enviado', items: 1, shipping: 'Shalom' },
    { id: '#1203', customer: 'Carlos Loayza', date: '29/12/2025', total: 210.00, status: 'Entregado', items: 3, shipping: 'Olva Courier' },
    { id: '#1202', customer: 'Ana Belén', date: '28/12/2025', total: 45.00, status: 'Entregado', items: 1, shipping: 'Recojo en tienda' },
    { id: '#1201', customer: 'Roberto Gomez', date: '28/12/2025', total: 120.00, status: 'Cancelado', items: 2, shipping: 'Olva Courier' },
];

export default function AdminOrders() {
    const [orders] = useState(initialOrders);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Entregado': return 'bg-green-100 text-green-600';
            case 'Enviado': return 'bg-blue-100 text-blue-600';
            case 'Pendiente': return 'bg-orange-100 text-orange-600';
            case 'Cancelado': return 'bg-red-100 text-red-600';
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
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer">
                        <span className="material-icons text-sm">filter_list</span>
                        Filtros
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer">
                        <span className="material-icons text-sm">download</span>
                        Exportar
                    </button>
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
                                <th className="px-6 py-4 text-left">Artículos</th>
                                <th className="px-6 py-4 text-left">Total</th>
                                <th className="px-6 py-4 text-left">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-bold text-gray-900 dark:text-white">{order.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{order.customer}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{order.shipping}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {order.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {order.items} {order.items === 1 ? 'item' : 'items'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white">
                                        S/ {order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary rounded-lg transition-colors cursor-pointer">
                                                <span className="material-icons text-sm">visibility</span>
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary rounded-lg transition-colors cursor-pointer">
                                                <span className="material-icons text-sm">more_vert</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-transparent">
                    <p className="text-xs text-gray-400">Cargando 5 de 1,200 pedidos</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors">Cargar más pedidos</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
