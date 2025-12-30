import { useState } from 'react';
import SEO from '../components/SEO';

const faqs = [
    {
        question: "¿Cuál es el estado de la ropa que venden?",
        answer: "Toda nuestra ropa es de segunda mano pero ha sido cuidadosamente seleccionada y revisada. Solo vendemos prendas en excelente estado, sin manchas, roturas o desgaste excesivo. Cada prenda pasa por un proceso de limpieza y vaporizado antes de ser puesta a la venta."
    },
    {
        question: "¿Hacen envíos a todo el Perú?",
        answer: "Sí, realizamos envíos a nivel nacional a través de Olva Courier y Shalom. El costo y tiempo de entrega varían según la provincia de destino."
    },
    {
        question: "¿Puedo realizar cambios o devoluciones?",
        answer: "Al ser prendas únicas de segunda mano, no aceptamos devoluciones. Sin embargo, si el producto presenta algún desperfecto no mencionado en la descripción, puedes contactarnos dentro de las 48 horas de recibido para evaluar un cambio o nota de crédito."
    },
    {
        question: "¿Cuáles son los métodos de pago?",
        answer: "Aceptamos pagos con tarjeta de crédito/débito, transferencias bancarias (BCP, Interbank), Yape y Plin. Todos nuestros pagos son procesados de forma segura."
    },
    {
        question: "¿Cómo sé cuál es mi talla correcta?",
        answer: "En la descripción de cada producto incluimos las medidas exactas en centímetros (largo y ancho). Recomendamos comparar estas medidas con una prenda que ya tengas para asegurar un ajuste perfecto, ya que las tallas pueden variar entre marcas."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <SEO
                title="Preguntas Frecuentes | Eguva"
                description="Encuentra respuestas a las dudas más comunes sobre nuestras prendas, envíos y métodos de pago."
            />

            <section className="pt-32 pb-20 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase text-primary dark:text-white mb-4 tracking-tight">
                            Preguntas Frecuentes
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                            Todo lo que necesitas saber para comprar con confianza en Eguva.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer group"
                                >
                                    <span className={`font-bold text-lg transition-colors duration-300 ${openIndex === index ? 'text-primary dark:text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white'}`}>
                                        {faq.question}
                                    </span>
                                    <span className={`material-icons transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary dark:text-white' : 'text-gray-400'}`}>
                                        expand_more
                                    </span>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 border-t border-gray-50 dark:border-gray-800/50 pt-4 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-20 bg-primary dark:bg-white rounded-3xl p-8 md:p-12 text-center text-white dark:text-primary relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Aún tienes dudas?</h2>
                            <p className="mb-8 opacity-90">Escríbenos directamente por WhatsApp y te ayudaremos en minutos.</p>
                            <a
                                href="https://wa.me/51994845979"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white dark:bg-primary text-primary dark:text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 cursor-pointer shadow-lg"
                            >
                                <span className="material-icons">chat</span>
                                Contactar por WhatsApp
                            </a>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    </div>
                </div>
            </section>
        </>
    );
}
