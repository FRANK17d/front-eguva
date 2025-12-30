import SEO from '../components/SEO';

export default function ShippingPolicyPage() {
    return (
        <>
            <SEO
                title="Políticas de Envío | Eguva"
                description="Conoce nuestros tiempos de entrega, costos de envío y zonas de cobertura en todo el Perú."
            />

            <section className="pt-32 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase text-primary dark:text-white mb-4 tracking-tight">
                            Políticas de Envío
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                            Información transparente sobre cómo llevamos tus tesoros hasta tu puerta.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            { icon: 'local_shipping', title: 'Envío Seguro', desc: 'Embalamos cada prenda con cuidado para que llegue impecable.' },
                            { icon: 'schedule', title: 'Tiempos Rápidos', desc: 'Despachamos tu pedido en máximo 24-48 horas hábiles.' },
                            { icon: 'location_on', title: 'Seguimiento', desc: 'Te enviamos el código de tracking para que sigas tu pedido.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-card-dark rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                                <span className="material-icons text-4xl text-primary dark:text-white mb-4">{item.icon}</span>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-sm space-y-12">
                        {/* Section 1 */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white flex items-center justify-center font-bold">1</span>
                                <h2 className="text-2xl font-bold text-primary dark:text-white">Zonas de Cobertura</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                Actualmente realizamos envíos a todo el territorio peruano. Trabajamos con los operadores de logística más confiables para asegurar que tu pedido llegue sin contratiempos:
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                                    Lima Metropolitana y Callao
                                </li>
                                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                                    Principales ciudades de provincias
                                </li>
                                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                                    Zonas remotas y selva baja
                                </li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white flex items-center justify-center font-bold">2</span>
                                <h2 className="text-2xl font-bold text-primary dark:text-white">Tiempos de Entrega</h2>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Destino</th>
                                            <th className="px-6 py-4">Tiempo Estimado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        <tr className="bg-white dark:bg-card-dark">
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Lima Metropolitana</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">24 a 48 horas hábiles</td>
                                        </tr>
                                        <tr className="bg-gray-50/30 dark:bg-card-dark/50">
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Provincias Cercanas</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">2 a 4 días hábiles</td>
                                        </tr>
                                        <tr className="bg-white dark:bg-card-dark">
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Selva y Zonas Remotas</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">4 a 7 días hábiles</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white flex items-center justify-center font-bold">3</span>
                                <h2 className="text-2xl font-bold text-primary dark:text-white">Costos de Envío</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                El costo se calcula automáticamente al finalizar tu compra según el destino. Ofrecemos **Envío Gratis** en compras mayores a S/200.00 para Lima y S/300.00 para Provincias.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
