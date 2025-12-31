import { useState, useEffect } from 'react';
import { productosAPI, categoriasAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/SEO';

export default function AdminProducts() {
    const toast = useToast();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtros
    const [buscar, setBuscar] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [total, setTotal] = useState(0);

    // Modal de producto
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        categoriaId: '',
        precio: '',
        precioOriginal: '',
        imagen: '',
        imagenes: [],
        condicion: 'Bueno',
        talla: '',
        stock: 1,
        estado: 'activo',
        destacado: false
    });
    const [nuevaImagen, setNuevaImagen] = useState('');
    const [saving, setSaving] = useState(false);

    // Cargar productos
    const fetchProductos = async () => {
        try {
            setLoading(true);
            const params = {};
            if (buscar) params.buscar = buscar;
            if (categoriaFiltro) params.categoria = categoriaFiltro;
            if (estadoFiltro) params.estado = estadoFiltro;
            params.pagina = pagina;
            params.limite = 10;

            const response = await productosAPI.getAdmin(params);

            setProductos(response.data.productos);
            setTotal(response.data.total);
            setTotalPaginas(response.data.totalPaginas);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError('Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    // Cargar categorías
    const fetchCategorias = async () => {
        try {
            const response = await categoriasAPI.getAll();
            setCategorias(response.data);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [buscar, categoriaFiltro, estadoFiltro, pagina]);

    // Abrir modal para nuevo producto
    const handleNew = () => {
        setEditingProduct(null);
        setFormData({
            nombre: '',
            descripcion: '',
            categoriaId: categorias[0]?.id || '',
            precio: '',
            precioOriginal: '',
            imagen: '',
            imagenes: [],
            condicion: 'Bueno',
            talla: '',
            stock: 1,
            estado: 'activo',
            destacado: false
        });
        setNuevaImagen('');
        setShowModal(true);
    };

    // Abrir modal para editar
    const handleEdit = (producto) => {
        setEditingProduct(producto);
        // Parsear imagenes si viene como string
        let imagenesArr = [];
        if (producto.imagenes) {
            if (typeof producto.imagenes === 'string') {
                try { imagenesArr = JSON.parse(producto.imagenes); } catch { imagenesArr = []; }
            } else if (Array.isArray(producto.imagenes)) {
                imagenesArr = producto.imagenes;
            }
        }
        setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            categoriaId: producto.categoriaId,
            precio: producto.precio,
            precioOriginal: producto.precioOriginal || '',
            imagen: producto.imagen || '',
            imagenes: imagenesArr,
            condicion: producto.condicion,
            talla: producto.talla || '',
            stock: producto.stock,
            estado: producto.estado,
            destacado: producto.destacado
        });
        setNuevaImagen('');
        setShowModal(true);
    };

    // Guardar producto
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                ...formData,
                precio: parseFloat(formData.precio),
                precioOriginal: formData.precioOriginal ? parseFloat(formData.precioOriginal) : null,
                stock: parseInt(formData.stock),
                categoriaId: parseInt(formData.categoriaId)
            };

            if (editingProduct) {
                await productosAPI.update(editingProduct.id, data);
                toast.success('Producto actualizado correctamente');
            } else {
                await productosAPI.create(data);
                toast.success('Producto creado correctamente');
            }

            setShowModal(false);
            fetchProductos();
        } catch (err) {
            console.error('Error al guardar:', err);
            toast.error(err.response?.data?.message || 'Error al guardar el producto');
        } finally {
            setSaving(false);
        }
    };

    // Eliminar producto
    const handleDelete = async (id) => {
        const confirmed = await toast.confirm({
            title: '¿Eliminar producto?',
            message: 'Esta acción no se puede deshacer. El producto será eliminado permanentemente.',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            await productosAPI.delete(id);
            toast.success('Producto eliminado correctamente');
            fetchProductos();
        } catch (err) {
            console.error('Error al eliminar:', err);
            toast.error('Error al eliminar el producto');
        }
    };

    const getEstadoColor = (estado) => {
        const colors = {
            activo: 'bg-green-100 text-green-600',
            inactivo: 'bg-gray-100 text-gray-600',
            agotado: 'bg-red-100 text-red-600',
            borrador: 'bg-yellow-100 text-yellow-600'
        };
        return colors[estado] || colors.inactivo;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Gestión de Productos | Eguva Admin" description="Administra el catálogo de productos de Eguva." />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gestiona tu catálogo de moda sostenible.</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer"
                >
                    <span className="material-icons">add</span>
                    Nuevo Producto
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <div className="relative flex-grow">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={buscar}
                        onChange={(e) => { setBuscar(e.target.value); setPagina(1); }}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm dark:text-white"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={categoriaFiltro}
                        onChange={(e) => { setCategoriaFiltro(e.target.value); setPagina(1); }}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm outline-none cursor-pointer dark:text-white"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    <select
                        value={estadoFiltro}
                        onChange={(e) => { setEstadoFiltro(e.target.value); setPagina(1); }}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm outline-none cursor-pointer dark:text-white"
                    >
                        <option value="">Estado: Todos</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="agotado">Agotado</option>
                        <option value="borrador">Borrador</option>
                    </select>
                </div>
            </div>

            {/* Products List/Table */}
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Cargando productos...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center text-red-500">{error}</div>
                ) : productos.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="material-icons text-4xl text-gray-300 mb-2">inventory_2</span>
                        <p className="text-gray-500">No hay productos</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
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
                                    {productos.map((producto) => (
                                        <tr key={producto.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                        {producto.imagen ? (
                                                            <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <span className="material-icons">image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{producto.nombre}</p>
                                                        <p className="text-[10px] text-gray-400 tracking-wider">ID: #{producto.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {producto.categoria?.nombre || 'Sin categoría'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-bold text-gray-900 dark:text-white">S/ {parseFloat(producto.precio).toFixed(2)}</span>
                                                {producto.precioOriginal && (
                                                    <span className="text-xs text-gray-400 line-through ml-2">
                                                        S/ {parseFloat(producto.precioOriginal).toFixed(2)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium ${producto.stock <= 2 ? 'text-red-500 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {producto.stock} unids.
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getEstadoColor(producto.estado)}`}>
                                                    {producto.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(producto)}
                                                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-icons text-sm">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(producto.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-icons text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden divide-y divide-gray-50 dark:divide-gray-800">
                            {productos.map((producto) => (
                                <div key={producto.id} className="p-4 flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                            {producto.imagen ? (
                                                <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <span className="material-icons">image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold text-gray-900 dark:text-white leading-tight">{producto.nombre}</p>
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${getEstadoColor(producto.estado)}`}>
                                                    {producto.estado}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 tracking-wider">ID: #{producto.id}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {producto.categoria?.nombre || 'Sin categoría'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Precio</span>
                                            <span className="font-bold text-gray-900 dark:text-white">S/ {parseFloat(producto.precio).toFixed(2)}</span>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Stock</span>
                                            <span className={`text-sm font-bold ${producto.stock <= 2 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                                {producto.stock}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(producto)}
                                                className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg cursor-pointer"
                                            >
                                                <span className="material-icons text-base">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(producto.id)}
                                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg cursor-pointer"
                                            >
                                                <span className="material-icons text-base">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30 dark:bg-transparent text-center sm:text-left">
                            <p className="text-xs text-gray-400">
                                Mostrando {((pagina - 1) * 10) + 1} a {Math.min(pagina * 10, total)} de {total} productos
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    disabled={pagina === 1}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <span className="px-4 py-2 bg-primary text-white dark:bg-white dark:text-primary rounded-lg text-sm font-bold">{pagina}</span>
                                <button
                                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                    disabled={pagina === totalPaginas}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal de Producto */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto overflow-x-hidden scrollbar-hide py-6 sm:py-12">
                    <div className="flex min-h-full items-start sm:items-center justify-center p-4">
                        <div className="bg-white dark:bg-card-dark rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-2xl w-full animate-slide-up relative overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-card-dark z-10 rounded-t-2xl sm:rounded-t-3xl">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <span className="material-icons">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría *</label>
                                        <select
                                            required
                                            value={formData.categoriaId}
                                            onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {categorias.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condición</label>
                                        <select
                                            value={formData.condicion}
                                            onChange={(e) => setFormData({ ...formData, condicion: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                                        >
                                            <option value="Excelente">Excelente</option>
                                            <option value="Muy Bueno">Muy Bueno</option>
                                            <option value="Bueno">Bueno</option>
                                            <option value="Regular">Regular</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio (S/) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            required
                                            value={formData.precio}
                                            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio Original (S/)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={formData.precioOriginal}
                                            onChange={(e) => setFormData({ ...formData, precioOriginal: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="Para mostrar descuento"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Talla</label>
                                        <input
                                            type="text"
                                            value={formData.talla}
                                            onChange={(e) => setFormData({ ...formData, talla: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="S, M, L, XL, 38, 42..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen Principal</label>
                                        <input
                                            type="text"
                                            value={formData.imagen}
                                            onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="https://ejemplo.com/imagen-principal.jpg"
                                        />
                                        {formData.imagen && (
                                            <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                <img src={formData.imagen} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imágenes Adicionales</label>
                                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={nuevaImagen}
                                                onChange={(e) => setNuevaImagen(e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-sm"
                                                placeholder="https://ejemplo.com/otra-imagen.jpg"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (nuevaImagen.trim()) {
                                                            setFormData({ ...formData, imagenes: [...formData.imagenes, nuevaImagen.trim()] });
                                                            setNuevaImagen('');
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (nuevaImagen.trim()) {
                                                        setFormData({ ...formData, imagenes: [...formData.imagenes, nuevaImagen.trim()] });
                                                        setNuevaImagen('');
                                                    }
                                                }}
                                                className="h-10 px-4 bg-primary dark:bg-white text-white dark:text-primary rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center"
                                            >
                                                <span className="material-icons">add</span>
                                                <span className="sm:hidden ml-2 font-bold uppercase tracking-widest text-[10px]">Agregar Imagen</span>
                                            </button>
                                        </div>
                                        {formData.imagenes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.imagenes.map((img, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                            <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23ddd" width="80" height="80"/><text fill="%23999" font-size="10" x="50%" y="50%" text-anchor="middle" dy=".3em">Error</text></svg>'} />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, imagenes: formData.imagenes.filter((_, i) => i !== index) })}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                        >
                                                            <span className="material-icons text-xs">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">Presiona Enter o el botón + para agregar cada imagen</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                        <textarea
                                            rows={3}
                                            value={formData.descripcion}
                                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                                        <select
                                            value={formData.estado}
                                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                            <option value="borrador">Borrador</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.destacado}
                                                onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Producto destacado</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 bg-white dark:bg-card-dark z-10 rounded-b-2xl sm:rounded-b-3xl">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="w-full sm:w-auto px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full sm:w-auto px-8 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/10"
                                    >
                                        {saving ? 'Cargando...' : (editingProduct ? 'Actualizar' : 'Crear')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
