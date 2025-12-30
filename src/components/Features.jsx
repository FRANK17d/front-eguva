const features = [
    {
        id: 1,
        icon: 'verified',
        title: 'Calidad Verificada',
        description: 'Cada pieza es revisada personalmente. Solo vendemos artículos en buen estado que nosotros mismos usaríamos.',
    },
    {
        id: 2,
        icon: 'savings',
        title: 'Precios Justos',
        description: 'Ahorra hasta un 70% comparado con tiendas tradicionales. Moda de calidad sin romper el bolsillo.',
    },
    {
        id: 3,
        icon: 'favorite',
        title: 'Atención Personal',
        description: 'Somos un negocio familiar. Te atendemos personalmente y resolvemos cualquier duda que tengas.',
    },
];

function FeatureCard({ feature }) {
    return (
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group hover-card cursor-pointer">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons text-3xl text-primary dark:text-white">
                    {feature.icon}
                </span>
            </div>
            <h3 className="font-display text-xl font-bold uppercase mb-3 text-primary dark:text-white">
                {feature.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
            </p>
        </div>
    );
}

export default function Features() {
    return (
        <section id="sobre-nosotros" className="py-24 bg-background-light dark:bg-background-dark relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-800 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl lg:text-5xl font-bold uppercase text-primary dark:text-white mb-6">
                        ¿Por Qué <span className="text-gray-500">Eguva</span>?
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
                        Somos un emprendimiento familiar que nació de la pasión por la moda y el deseo de ofrecer alternativas sostenibles y accesibles para todos.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </div>

                {/* WhatsApp CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">¿Tienes alguna pregunta? ¡Escríbeme!</p>
                    <a
                        href="https://wa.me/51994845979"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Escríbeme por WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
}
