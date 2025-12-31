import { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import { configAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const response = await configAPI.getAdmin();
            if (response.data.status === 'success') {
                setConfigs(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar configuraciones:', error);
            toast.error('Error al cargar las configuraciones');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateConfig = async (clave, valor) => {
        try {
            const response = await configAPI.update({ clave, valor: valor.toString() });
            if (response.data.status === 'success') {
                toast.success('Configuración actualizada');
                setConfigs(prev => prev.map(c => c.clave === clave ? { ...c, valor: valor.toString() } : c));
            }
        } catch (error) {
            console.error('Error al actualizar configuración:', error);
            toast.error('Error al actualizar la configuración');
        }
    };

    const getConfigValue = (clave) => {
        const config = configs.find(c => c.clave === clave);
        return config ? config.valor : '';
    };

    if (loading) {
        return <div className="p-8 text-center">Cargando configuraciones...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in text-secondary">
            <SEO title="Configuración | Eguva Admin" description="Configura los parámetros generales de la tienda Eguva." />

            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
                <p className="text-gray-500 dark:text-gray-400">Administra los ajustes generales de tu plataforma.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Settings */}
                    <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-icons text-primary dark:text-white">local_shipping</span>
                            Configuración de Envíos
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">
                                    Costo de Envío Estándar (S/)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={getConfigValue('shipping_cost')}
                                        onChange={(e) => setConfigs(prev => prev.map(c => c.clave === 'shipping_cost' ? { ...c, valor: e.target.value } : c))}
                                        className="flex-grow px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                    />
                                    <button
                                        onClick={() => handleUpdateConfig('shipping_cost', getConfigValue('shipping_cost'))}
                                        className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                                <p className="mt-1 text-[10px] text-gray-400">Costo fijo que se aplicará a todos los pedidos.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">
                                    Monto para Envío Gratis (S/)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={getConfigValue('free_shipping_threshold')}
                                        onChange={(e) => setConfigs(prev => prev.map(c => c.clave === 'free_shipping_threshold' ? { ...c, valor: e.target.value } : c))}
                                        className="flex-grow px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                    />
                                    <button
                                        onClick={() => handleUpdateConfig('free_shipping_threshold', getConfigValue('free_shipping_threshold'))}
                                        className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                                <p className="mt-1 text-[10px] text-gray-400">Si el carrito supera este monto, el envío será gratuito.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 opacity-60 pointer-events-none">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-icons text-primary dark:text-white">storefront</span>
                            Información de la Tienda (Próximamente)
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">Nombre de la Tienda</label>
                                <input type="text" defaultValue="Eguva" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">Correo de Contacto</label>
                                <input type="email" defaultValue="contacto@eguva.pe" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none dark:text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-primary dark:bg-card-dark rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <h3 className="text-lg font-bold mb-4 relative z-10">Estado del Sistema</h3>
                        <div className="flex items-center gap-2 mb-6 relative z-10">
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="font-bold">Tienda Activa</span>
                        </div>
                        <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all relative z-10">
                            Cambiar a Mantenimiento
                        </button>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Ayuda</h3>
                        <p className="text-sm text-gray-500 mb-4">¿Necesitas ayuda con la configuración?</p>
                        <a href="https://wa.me/51994845979" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-bold hover:underline">
                            <span className="material-icons">help_outline</span>
                            Contactar Soporte
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
