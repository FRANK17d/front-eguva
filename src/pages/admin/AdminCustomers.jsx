import { useState } from 'react';
import SEO from '../../components/SEO';

const initialCustomers = [
    { id: 1, name: 'Juan Perez', email: 'juan.perez@example.com', orders: 12, totalSpent: 1450.00, lastOrder: '30/12/2025', status: 'Activo' },
    { id: 2, name: 'Maria Garcia', email: 'maria.g@gmail.com', orders: 5, totalSpent: 420.00, lastOrder: '28/12/2025', status: 'Activo' },
    { id: 3, name: 'Carlos Loayza', email: 'cloayza@outlook.com', orders: 2, totalSpent: 310.00, lastOrder: '25/12/2025', status: 'Inactivo' },
    { id: 4, name: 'Ana Belén', email: 'ana.belen@empresa.pe', orders: 1, totalSpent: 45.00, lastOrder: '20/12/2025', status: 'Activo' },
];

export default function AdminCustomers() {
    const [customers] = useState(initialCustomers);

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Gestión de Clientes | Eguva Admin" description="Administra la base de datos de clientes de Eguva." />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clientes</h1>
                    <p className="text-gray-500 dark:text-gray-400">Administra y fideliza a tu comunidad.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer">
                        <span className="material-icons">person_add</span>
                        Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                            <tr>
                                <th className="px-6 py-4 text-left">Cliente</th>
                                <th className="px-6 py-4 text-left">Pedidos</th>
                                <th className="px-6 py-4 text-left">Total Gastado</th>
                                <th className="px-6 py-4 text-left">Última Compra</th>
                                <th className="px-6 py-4 text-left">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary dark:text-white font-bold">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{customer.name}</p>
                                                <p className="text-[10px] text-gray-400">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {customer.orders} pedidos
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white">
                                        S/ {customer.totalSpent.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {customer.lastOrder}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${customer.status === 'Activo' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary rounded-lg transition-colors cursor-pointer">
                                                <span className="material-icons text-sm">mail</span>
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary rounded-lg transition-colors cursor-pointer">
                                                <span className="material-icons text-sm">edit</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
