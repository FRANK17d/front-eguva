import { useState, useEffect } from 'react';
import { boletinAPI } from '../../services/api';
import SEO from '../../components/SEO';
import { useToast } from '../../context/ToastContext';

export default function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const toast = useToast();

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await boletinAPI.listar({
                pagina: page,
                limite: 10,
                buscar: searchTerm
            });
            setSubscribers(response.data.suscriptores);
            setTotalPages(response.data.paginas);
            setTotalResults(response.data.total);
            setError(null);
        } catch (err) {
            console.error('Error al cargar suscriptores:', err);
            setError('No se pudieron cargar los suscriptores. Verifica tus permisos de administrador.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [page]);

    // Búsqueda con delay
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (page === 1) fetchSubscribers(); // Reutilizamos lógica de búsqueda
            else setPage(1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Correo copiado al portapapeles');
    };

    const exportToCSV = async () => {
        try {
            // Para exportar todo, pedimos una lista sin límites (o un límite muy alto)
            const response = await boletinAPI.listar({ limite: 10000, buscar: searchTerm });
            const allSubs = response.data.suscriptores;

            if (allSubs.length === 0) return;

            const headers = ['ID', 'Email', 'Fecha Suscripcion', 'Hora', 'Estado'];
            const rows = allSubs.map(sub => {
                const date = new Date(sub.createdAt);
                return [
                    sub.id,
                    sub.correo.toLowerCase(),
                    date.toLocaleDateString(),
                    date.toLocaleTimeString(),
                    sub.activo ? 'ACTIVO' : 'INACTIVO'
                ];
            });

            const BOM = '\uFEFF';
            const csvContent = headers.join(";") + "\n" + rows.map(r => r.join(";")).join("\n");
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `comunidad_eguva_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Lista completa exportada correctamente');
        } catch (error) {
            toast.error('Error al exportar la lista');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Gestión de Suscriptores | Eguva Admin" description="Administra la lista de correos del boletín de noticias." />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suscriptores Boletín</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Personas interesadas en novedades: <span className="font-bold text-primary dark:text-white">{totalResults}</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
                    <div className="relative flex-1 sm:w-80">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Buscar correo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                        />
                    </div>

                    <button
                        onClick={exportToCSV}
                        disabled={totalResults === 0}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <span className="material-icons">download</span>
                        Exportar CSV
                    </button>
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
                        <p className="text-gray-500">Cargando suscriptores...</p>
                    </div>
                ) : subscribers.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Correo Electrónico</th>
                                        <th className="px-6 py-4 text-left">Fecha Suscripción</th>
                                        <th className="px-6 py-4 text-left">Estado</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {subscribers.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary dark:text-white">
                                                        <span className="material-icons text-sm">alternate_email</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white lowercase">{sub.correo}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(sub.createdAt).toLocaleDateString('es-PE', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${sub.activo
                                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {sub.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(sub.correo)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 rounded-lg transition-colors cursor-pointer"
                                                        title="Copiar correo"
                                                    >
                                                        <span className="material-icons text-sm">content_copy</span>
                                                    </button>
                                                    <a
                                                        href={`mailto:${sub.correo}`}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary rounded-lg transition-colors cursor-pointer"
                                                        title="Redactar correo"
                                                    >
                                                        <span className="material-icons text-sm">alternate_email</span>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                        <span className="material-icons text-6xl text-gray-200 dark:text-gray-800 mb-4">mail_outline</span>
                        <p className="text-gray-500 dark:text-gray-400">No hay suscriptores registrados aún.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
