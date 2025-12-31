import { useState, useEffect } from 'react';
import { categoriasAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/SEO';

export default function AdminCategories() {
    const toast = useToast();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        imagen: '',
        icono: 'category',
        orden: 0,
        activo: true
    });
    const [saving, setSaving] = useState(false);

    // Cargar categorías
    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const response = await categoriasAPI.getAll();
            setCategorias(response.data);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
            setError('Error al cargar las categorías');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    // Abrir modal para nueva categoría
    const handleNew = () => {
        setEditingCategory(null);
        setFormData({
            nombre: '',
            descripcion: '',
            imagen: '',
            icono: 'category',
            orden: categorias.length,
            activo: true
        });
        setShowModal(true);
    };

    // Abrir modal para editar
    const handleEdit = (categoria) => {
        setEditingCategory(categoria);
        setFormData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || '',
            imagen: categoria.imagen || '',
            icono: categoria.icono || 'category',
            orden: categoria.orden,
            activo: categoria.activo
        });
        setShowModal(true);
    };

    // Guardar categoría
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editingCategory) {
                await categoriasAPI.update(editingCategory.id, formData);
                toast.success('Categoría actualizada correctamente');
            } else {
                await categoriasAPI.create(formData);
                toast.success('Categoría creada correctamente');
            }

            setShowModal(false);
            fetchCategorias();
        } catch (err) {
            console.error('Error al guardar:', err);
            toast.error(err.response?.data?.message || 'Error al guardar la categoría');
        } finally {
            setSaving(false);
        }
    };

    // Eliminar categoría
    const handleDelete = async (id) => {
        const confirmed = await toast.confirm({
            title: '¿Eliminar categoría?',
            message: 'Esta acción no se puede deshacer. La categoría será eliminada permanentemente.',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            await categoriasAPI.delete(id);
            toast.success('Categoría eliminada correctamente');
            fetchCategorias();
        } catch (err) {
            console.error('Error al eliminar:', err);
            toast.error(err.response?.data?.message || 'Error al eliminar la categoría');
        }
    };

    // Iconos comunes para Material Icons
    const iconOptions = [
        'category', 'checkroom', 'directions_walk', 'watch', 'local_offer',
        'shopping_bag', 'style', 'diamond', 'spa', 'sports_esports',
        'backpack', 'headphones', 'phone_iphone', 'laptop', 'chair'
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Gestión de Categorías | Eguva Admin" description="Administra las categorías de productos de Eguva." />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categorías</h1>
                    <p className="text-gray-500 dark:text-gray-400">Organiza tus productos por tipos y colecciones.</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer"
                >
                    <span className="material-icons">add</span>
                    Nueva Categoría
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando categorías...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorias.map((cat) => (
                        <div key={cat.id} className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-all hover:shadow-md group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-primary dark:text-white group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <span className="material-icons text-3xl">{cat.icono || 'category'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <span className="material-icons text-sm">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <span className="material-icons text-sm">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{cat.nombre}</h3>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-4">/{cat.slug}</p>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500 font-medium">Orden: {cat.orden}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${cat.activo ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {cat.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Category Placeholder */}
                    <button
                        onClick={handleNew}
                        className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-primary hover:text-primary dark:hover:border-white dark:hover:text-white transition-all group cursor-pointer min-h-[200px]"
                    >
                        <div className="h-14 w-14 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-icons text-3xl">add</span>
                        </div>
                        <span className="font-bold text-sm">Nueva Categoría</span>
                    </button>
                </div>
            )}

            {/* Modal de Categoría */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Ej: Ropa, Zapatos, Accesorios"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                <textarea
                                    rows={2}
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de Imagen (opcional)</label>
                                <input
                                    type="text"
                                    value={formData.imagen}
                                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icono</label>
                                <div className="flex flex-wrap gap-2">
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icono: icon })}
                                            className={`p-3 rounded-xl border transition-all cursor-pointer ${formData.icono === icon
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
                                                }`}
                                        >
                                            <span className="material-icons">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Orden</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.orden}
                                        onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.activo}
                                            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activo</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                                >
                                    {saving ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
