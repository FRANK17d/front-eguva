import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            console.log('Newsletter subscription:', email);
            setIsSubmitted(true);
            setEmail('');
            setTimeout(() => setIsSubmitted(false), 3000);
        }
    };

    return (
        <section className="py-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-900 dark:to-black">
            <div className="max-w-4xl mx-auto px-4 text-center">
                {/* Icon */}
                <span className="material-icons text-5xl text-gray-600 dark:text-gray-400 mb-4">
                    notifications_active
                </span>

                {/* Heading */}
                <h2 className="font-display text-4xl font-bold uppercase text-primary dark:text-white mb-4">
                    ¡Entérate Primero!
                </h2>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                    Déjame tu correo y te aviso cuando lleguen nuevos artículos, ofertas especiales o promociones exclusivas. 📬
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu correo electrónico"
                        required
                        className="flex-grow px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 dark:text-white shadow-sm placeholder-gray-400 cursor-text"
                    />
                    <button
                        type="submit"
                        className="px-8 py-3 bg-primary text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors rounded-lg shadow-lg hover:shadow-xl cursor-pointer"
                    >
                        {isSubmitted ? '¡Listo!' : 'Avisarme'}
                    </button>
                </form>

                {/* Privacy Note */}
                <p className="text-xs text-gray-500 mt-4">
                    Solo te escribiré cuando haya algo bueno. Nada de spam, lo prometo. 🤞
                </p>

                {/* Success Message */}
                {isSubmitted && (
                    <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg animate-fade-in inline-flex items-center gap-2">
                        <span className="material-icons text-sm">check_circle</span>
                        ¡Gracias! Te avisaré cuando llegue algo nuevo.
                    </div>
                )}

                {/* WhatsApp Alternative */}
                <div className="mt-10 pt-8 border-t border-gray-400/30">
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                        ¿Prefieres WhatsApp? También puedo avisarte por ahí
                    </p>
                    <a
                        href="https://wa.me/51994845979?text=Hola!%20Quiero%20recibir%20avisos%20de%20nuevos%20productos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-500 font-medium transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Contáctame por WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
}
