import { useState } from 'react';
import SEO from '../../components/SEO';

const initialCategories = [
    { id: 1, name: 'Ropa', slug: 'ropa', items: 156, icon: 'checkroom', status: 'Activo' },
    { id: 2, name: 'Zapatos', slug: 'zapatos', items: 42, icon: 'directions_walk', status: 'Activo' },
    { id: 3, name: 'Accesorios', slug: 'accesorios', items: 89, icon: 'watch', status: 'Activo' },
    { id: 4, name: 'Ofertas', slug: 'ofertas', items: 33, icon: 'local_offer', status: 'Activo' },
];

export default function AdminCategories() {
    const [categories] = useState(initialCategories);

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Gestión de Categorías | Eguva Admin" description="Administra las categorías de productos de Eguva." />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categorías</h1>
                    <p className="text-gray-500 dark:text-gray-400">Organiza tus productos por tipos y colecciones.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer">
                    <span className="material-icons">add</span>
                    Nueva Categoría
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-all hover:shadow-md group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-14 w-14 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-primary dark:text-white group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <span className="material-icons text-3xl">{cat.icon}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 rounded-xl transition-colors">
                                    <span className="material-icons text-sm">edit</span>
                                </button>
                                <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{cat.name}</h3>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-4">/{cat.slug}</p>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">{cat.items} productos</span>
                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    {cat.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Category Placeholder */}
                <button className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-primary hover:text-primary dark:hover:border-white dark:hover:text-white transition-all group cursor-pointer">
                    <div className="h-14 w-14 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-icons text-3xl">add</span>
                    </div>
                    <span className="font-bold text-sm">Nueva Categoría</span>
                </button>
            </div>
        </div>
    );
}
