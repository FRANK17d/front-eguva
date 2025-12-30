import SEO from '../../components/SEO';

export default function AdminSettings() {
    return (
        <div className="space-y-8 animate-fade-in">
            <SEO title="Configuración | Eguva Admin" description="Configura los parámetros generales de la tienda Eguva." />

            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
                <p className="text-gray-500 dark:text-gray-400">Administra los ajustes generales de tu plataforma.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-icons text-primary dark:text-white">storefront</span>
                            Información de la Tienda
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">Nombre de la Tienda</label>
                                <input type="text" defaultValue="Eguva" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">Correo de Contacto</label>
                                <input type="email" defaultValue="contacto@eguva.pe" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest text-[10px]">Dirección Física</label>
                                <input type="text" defaultValue="Lima, Perú" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="px-8 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer">
                                Guardar Cambios
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-icons text-primary dark:text-white">payments</span>
                            Pagos y Moneda
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                        <span className="material-icons">check_circle</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Transferencia Bancaria / Yape</p>
                                        <p className="text-xs text-gray-400">Activo para todos los pedidos</p>
                                    </div>
                                </div>
                                <button className="text-primary dark:text-white font-bold text-xs hover:underline cursor-pointer">Configurar</button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 opacity-50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center">
                                        <span className="material-icons">credit_card</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Pasarela de Pagos (Mercado Pago/Culqi)</p>
                                        <p className="text-xs text-gray-400">Desactivado</p>
                                    </div>
                                </div>
                                <button className="text-primary dark:text-white font-bold text-xs hover:underline cursor-pointer">Activar</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-primary dark:bg-card-dark rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <h3 className="text-lg font-bold mb-4 relative z-10">Mantenimiento</h3>
                        <p className="text-sm text-gray-300 mb-6 relative z-10">Activa el modo mantenimiento para ocultar la tienda momentáneamente mientras realizas cambios.</p>

                        <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all relative z-10">
                            Activar Modo Mantenimiento
                        </button>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Usuarios Admin</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">A</div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Admin Eguva</p>
                                    <p className="text-[10px] text-gray-400">Super Admin</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                            + Invitar Administrador
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
