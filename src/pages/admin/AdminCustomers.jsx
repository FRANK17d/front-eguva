import { useState, useEffect } from 'react';
import { usuariosAPI } from '../../services/api';
import SEO from '../../components/SEO';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await usuariosAPI.getAll({
                pagina: page,
                limite: 10,
                buscar: searchTerm
            });
            setCustomers(response.data.usuarios);
            setTotalPages(response.data.paginas);
            setTotalResults(response.data.total);
            setError(null);
        } catch (err) {
            console.error('Error al cargar clientes:', err);
            setError('No se pudieron cargar los clientes. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    // Búsqueda con delay para no saturar el servidor
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (page === 1) fetchCustomers();
            else setPage(1); // Al buscar, volvemos a la página 1
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Gestión de Clientes | Eguva Admin" description="Administra la base de datos de clientes de Eguva." />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clientes</h1>
                    <p className="text-gray-500 dark:text-gray-400">Total registrados: <span className="font-bold text-primary dark:text-white">{totalResults}</span></p>
                </div>

                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
                    <div className="relative flex-1 sm:w-80">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center gap-3">
                    <span className="material-icons">error</span>
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Cargando comunidad...</p>
                    </div>
                ) : customers.length > 0 ? (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Cliente</th>
                                        <th className="px-6 py-4 text-left">Rol</th>
                                        <th className="px-6 py-4 text-left">Registro</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold">
                                                        {customer.nombre.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{customer.nombre}</p>
                                                        <p className="text-[10px] text-gray-400 lowercase">{customer.correo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${customer.rol === 'administrador'
                                                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {customer.rol}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(customer.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    <a href={`mailto:${customer.correo}`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary rounded-lg transition-colors cursor-pointer">
                                                        <span className="material-icons text-sm">mail</span>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
                            {customers.map((customer) => (
                                <div key={customer.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold text-sm">
                                                {customer.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-sm">{customer.nombre}</p>
                                                <p className="text-[10px] text-gray-400 lowercase">{customer.correo}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${customer.rol === 'administrador'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {customer.rol}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <p className="text-[10px] text-gray-400">
                                            Registrado: {new Date(customer.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            <a href={`mailto:${customer.correo}`} className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-lg">
                                                <span className="material-icons text-xs">mail</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30 dark:bg-transparent">
                                <p className="text-xs text-gray-400">
                                    Mostrando página <span className="font-bold text-gray-600 dark:text-gray-300">{page}</span> de <span className="font-bold text-gray-600 dark:text-gray-300">{totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 transition-all cursor-pointer"
                                    >
                                        <span className="material-icons text-sm">chevron_left</span>
                                    </button>

                                    <div className="flex gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setPage(i + 1)}
                                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === i + 1
                                                        ? 'bg-primary text-white shadow-md'
                                                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 transition-all cursor-pointer"
                                    >
                                        <span className="material-icons text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-20 text-center">
                        <span className="material-icons text-6xl text-gray-200 dark:text-gray-800 mb-4">group_off</span>
                        <p className="text-gray-500 dark:text-gray-400">No se encontraron clientes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
