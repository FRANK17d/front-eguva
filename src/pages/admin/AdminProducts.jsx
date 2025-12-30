import { useState } from 'react';
import SEO from '../../components/SEO';

const initialProducts = [
    { id: 1, name: 'Chaqueta Denim Clásica', category: 'Ropa', price: 89.00, stock: 5, status: 'Activo', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=100&h=100&fit=crop' },
    { id: 2, name: 'Zapatillas Nike Air', category: 'Zapatos', price: 120.00, stock: 2, status: 'Activo', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
    { id: 3, name: 'Bolso Vintage Cuero', category: 'Accesorios', price: 65.00, stock: 0, status: 'Agotado', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' },
    { id: 4, name: 'Camiza a Cuadros', category: 'Ropa', price: 35.00, stock: 12, status: 'Activo', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop' },
];

export default function AdminProducts() {
    const [products] = useState(initialProducts);

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Gestión de Productos | Eguva Admin" description="Administra el catálogo de productos de Eguva." />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gestiona tu catálogo de moda sostenible.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer">
                    <span className="material-icons">add</span>
                    Nuevo Producto
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-grow max-w-md">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm dark:text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm outline-none cursor-pointer dark:text-white">
                        <option>Todas las categorías</option>
                        <option>Ropa</option>
                        <option>Zapatos</option>
                        <option>Accesorios</option>
                    </select>
                    <select className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm outline-none cursor-pointer dark:text-white">
                        <option>Estado: Todos</option>
                        <option>Activo</option>
                        <option>Agotado</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                            <tr>
                                <th className="px-6 py-4 text-left">Producto</th>
                                <th className="px-6 py-4 text-left">Categoría</th>
                                <th className="px-6 py-4 text-left">Precio</th>
                                <th className="px-6 py-4 text-left">Stock</th>
                                <th className="px-6 py-4 text-left">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                                                <p className="text-[10px] text-gray-400 tracking-wider">ID: #PROD-{product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-bold text-gray-900 dark:text-white">S/ {product.price.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-medium ${product.stock <= 2 ? 'text-red-500 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {product.stock} unids.
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${product.status === 'Activo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 rounded-lg transition-colors cursor-pointer">
                                                <span className="material-icons text-sm">edit</span>
                                            </button>
                                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors cursor-pointer">
                                                <span className="material-icons text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Placeholder */}
                <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-transparent">
                    <p className="text-xs text-gray-400">Mostrando 1 a 4 de 320 productos</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-400 cursor-not-allowed">Anterior</button>
                        <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-bold">1</button>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">2</button>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
