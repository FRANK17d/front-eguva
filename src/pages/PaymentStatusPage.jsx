import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function PaymentStatusPage() {
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status'); // approved, rejected, pending

    // approved = exitoso
    const isSuccess = status === 'approved';
    const isPending = status === 'pending';

    return (
        <>
            <SEO title="Estado del Pago | Eguva" description="Resultado de tu proceso de pago." />

            <section className="pt-40 pb-20 bg-background-light dark:bg-background-dark min-h-screen flex items-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${isSuccess ? 'bg-green-100 text-green-600' :
                            isPending ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                        }`}>
                        <span className="material-icons text-5xl">
                            {isSuccess ? 'check_circle' : isPending ? 'schedule' : 'error'}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {isSuccess ? '¡Pago Exitoso!' : isPending ? 'Pago Pendiente' : 'Hubo un problema'}
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-10">
                        {isSuccess
                            ? 'Tu pedido ha sido procesado correctamente. ¡Gracias por confiar en Eguva!'
                            : isPending
                                ? 'Tu pago está siendo procesado. Te avisaremos cuando se confirme.'
                                : 'No pudimos procesar tu pago. Por favor, intenta nuevamente o usa otro método.'}
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/"
                            className="block w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            Volver a la tienda
                        </Link>

                        <Link
                            to="/mis-pedidos"
                            className="block w-full py-4 bg-white dark:bg-gray-800 text-primary dark:text-white border border-gray-100 dark:border-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                        >
                            Ver mis pedidos
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
