import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import SEO from '../components/SEO';

const forgotPasswordSchema = z.object({
    correo: z.string().email('Ingresa un correo electrónico válido')
});

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [submittedEmail, setSubmittedEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data) => {
        setError('');
        setIsLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, data);
            setSubmittedEmail(data.correo);
            setIsSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        setError('');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { correo: submittedEmail });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al reenviar el correo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Recuperar Contraseña | Eguva"
                description="Recupera el acceso a tu cuenta de Eguva. Te enviaremos un enlace para restablecer tu contraseña."
                keywords="recuperar contraseña eguva, olvidé contraseña, restablecer password"
            />

            <section className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-20 px-4 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full opacity-50 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full opacity-50 blur-3xl" />
                </div>

                <div className="w-full max-w-md relative">
                    {/* Card */}
                    <div className="bg-white dark:bg-card-dark rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-800 animate-fade-in">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <Link to="/" className="inline-block mb-6">
                                <h1 className="font-display text-3xl font-bold text-primary dark:text-white uppercase tracking-wider">
                                    Eguva
                                </h1>
                            </Link>

                            {!isSubmitted ? (
                                <>
                                    {/* Key Icon */}
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-icons text-3xl text-primary dark:text-white">
                                            lock_reset
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        ¿Olvidaste tu contraseña?
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        No te preocupes, te enviaremos instrucciones para recuperarla.
                                    </p>
                                </>
                            ) : (
                                <>
                                    {/* Success Icon */}
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-icons text-3xl text-green-600 dark:text-green-400">
                                            mark_email_read
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        ¡Revisa tu correo!
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Te hemos enviado un enlace para restablecer tu contraseña a:
                                    </p>
                                    <p className="text-primary dark:text-white font-medium mt-2">
                                        {submittedEmail}
                                    </p>
                                </>
                            )}
                        </div>

                        {!isSubmitted ? (
                            /* Email Form */
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Correo electrónico
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                            email
                                        </span>
                                        <input
                                            type="email"
                                            id="correo"
                                            {...register('correo')}
                                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.correo || error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent transition-all duration-300`}
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                    {errors.correo && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                            <span className="material-icons text-sm">error</span>
                                            {errors.correo.message}
                                        </p>
                                    )}
                                    {error && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                            <span className="material-icons text-sm">error</span>
                                            {error}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Enviar instrucciones</span>
                                            <span className="material-icons text-xl">send</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* Success State */
                            <div className="space-y-6">
                                {/* Tips */}
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <span className="font-medium text-gray-900 dark:text-white">Consejo:</span> Si no ves el correo en tu bandeja de entrada, revisa la carpeta de spam.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="material-icons text-sm">schedule</span>
                                        El enlace expirará en 1 hora
                                    </div>
                                </div>

                                {/* Resend Button */}
                                <button
                                    onClick={handleResend}
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Reenviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons text-xl">refresh</span>
                                            <span>Reenviar correo</span>
                                        </>
                                    )}
                                </button>

                                {/* Try another email */}
                                <button
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setSubmittedEmail('');
                                        reset();
                                    }}
                                    className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                                >
                                    Usar otro correo electrónico
                                </button>
                            </div>
                        )}

                        {/* Back to login link */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <Link
                                to="/iniciar-sesión"
                                className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <span className="material-icons text-sm">arrow_back</span>
                                Volver a iniciar sesión
                            </Link>
                        </div>
                    </div>

                    {/* Additional help */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ¿Necesitas ayuda?{' '}
                            <a
                                href="https://wa.me/51994845979?text=Hola!%20Necesito%20ayuda%20para%20recuperar%20mi%20cuenta"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary dark:text-white hover:underline font-medium"
                            >
                                Contáctanos
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
