import SEO from '../../components/SEO';

const stats = [
    { name: 'Ventas Totales', value: 'S/ 12,450.00', trend: '+12%', icon: 'payments', color: 'bg-green-500' },
    { name: 'Pedidos Nuevos', value: '48', trend: '+5', icon: 'shopping_cart', color: 'bg-blue-500' },
    { name: 'Clientes', value: '1,240', trend: '+18%', icon: 'people', color: 'bg-purple-500' },
    { name: 'Productos', value: '320', trend: 'Items', icon: 'inventory_2', color: 'bg-orange-500' },
];

const recentOrders = [
    { id: '#1205', customer: 'Juan Perez', items: '2 productos', total: 'S/ 145.00', status: 'Pendiente', date: 'Hace 2 horas' },
    { id: '#1204', customer: 'Maria Garcia', items: '1 producto', total: 'S/ 89.00', status: 'Enviado', date: 'Hace 5 horas' },
    { id: '#1203', customer: 'Carlos Loayza', items: '3 productos', total: 'S/ 210.00', status: 'Entregado', date: 'Hace 1 día' },
    { id: '#1202', customer: 'Ana Belén', items: '1 producto', total: 'S/ 45.00', status: 'Entregado', date: 'Hace 2 días' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Dashboard Admin | Eguva" description="Panel de control administrativo de Eguva." />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
                    <p className="text-gray-500 dark:text-gray-400">Resumen general de tu tienda hoy.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer">
                    <span className="material-icons">download</span>
                    Descargar Reporte
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.color} p-3 rounded-xl text-white flex items-center justify-center`}>
                                <span className="material-icons">{stat.icon}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.name}</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white dark:bg-card-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pedidos Recientes</h2>
                        <button className="text-primary dark:text-white font-bold text-sm hover:underline cursor-pointer">Ver todos</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left">Pedido</th>
                                    <th className="px-6 py-4 text-left">Cliente</th>
                                    <th className="px-6 py-4 text-left">Monto</th>
                                    <th className="px-6 py-4 text-left">Estado</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-gray-900 dark:text-white">{order.id}</span>
                                            <p className="text-[10px] text-gray-400">{order.date}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-medium text-gray-700 dark:text-gray-300">{order.customer}</p>
                                            <p className="text-[10px] text-gray-400">{order.items}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-primary dark:text-white">
                                            {order.total}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'Entregado' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'Enviado' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-orange-100 text-orange-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                                                <span className="material-icons text-gray-400 text-sm">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Chart Placeholder / Extra Stats */}
                <div className="bg-primary dark:bg-card-dark rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative grayscale-[0.2]">
                    <h2 className="text-xl font-bold mb-6">Estado de Almacén</h2>
                    <div className="space-y-6 relative z-10">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">Ropa</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="bg-white h-full w-[85%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">Zapatos</span>
                                <span>42%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="bg-white h-full w-[42%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">Accesorios</span>
                                <span>12%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="bg-white h-full w-[12%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <p className="text-xs text-gray-300 mb-1 font-bold uppercase tracking-widest">Consejo del día</p>
                        <p className="text-sm italic">"La categoría Zapatos necesita reabastecimiento pronto para mantener las ventas altas."</p>
                    </div>

                    {/* Decorative backdrop */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
