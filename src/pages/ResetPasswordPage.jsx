import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import SEO from '../components/SEO';

const resetPasswordSchema = z.object({
    contrasena: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmarContrasena: z.string()
}).refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
});

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(resetPasswordSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, {
                contrasena: data.contrasena
            });
            setSuccess(true);

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate('/iniciar-sesión');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al restablecer la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Token inválido</h2>
                    <Link to="/recuperar-contraseña" className="text-primary dark:text-white hover:underline">
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Restablecer Contraseña | Eguva"
                description="Crea una nueva contraseña para tu cuenta de Eguva"
                keywords="restablecer contraseña, nueva contraseña, reset password"
            />

            <section className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-20 px-4 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-300 dark:from-green-900 dark:to-blue-900 rounded-full opacity-50 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200 to-green-300 dark:from-blue-900 dark:to-green-900 rounded-full opacity-50 blur-3xl" />
                </div>

                <div className="w-full max-w-md relative">
                    {/* Card */}
                    <div className="bg-white dark:bg-card-dark rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-800 animate-fade-in">
                        {!success ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <Link to="/" className="inline-block mb-6">
                                        <h1 className="font-display text-3xl font-bold text-primary dark:text-white uppercase tracking-wider">
                                            Eguva
                                        </h1>
                                    </Link>
                                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-white/10">
                                        <span className="material-icons text-4xl text-primary dark:text-white">vpn_key</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Crea una nueva contraseña
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Asegúrate de que sea segura y fácil de recordar
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <span className="material-icons text-sm">error</span>
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                {/* Reset Password Form */}
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Password */}
                                    <div>
                                        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nueva contraseña
                                        </label>
                                        <div className="relative">
                                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                                lock
                                            </span>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="contrasena"
                                                {...register('contrasena')}
                                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.contrasena ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent transition-all duration-300`}
                                                placeholder="Mínimo 8 caracteres"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                                            >
                                                <span className="material-icons text-xl">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                        {errors.contrasena && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <span className="material-icons text-sm">error</span>
                                                {errors.contrasena.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Confirmar contraseña
                                        </label>
                                        <div className="relative">
                                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                                lock_outline
                                            </span>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                id="confirmarContrasena"
                                                {...register('confirmarContrasena')}
                                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.confirmarContrasena ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent transition-all duration-300`}
                                                placeholder="Repite tu contraseña"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                                            >
                                                <span className="material-icons text-xl">
                                                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                        {errors.confirmarContrasena && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <span className="material-icons text-sm">error</span>
                                                {errors.confirmarContrasena.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password requirements */}
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tu contraseña debe contener:
                                        </p>
                                        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                            <li className="flex items-center gap-2">
                                                <span className="material-icons text-xs">check_circle</span>
                                                Mínimo 8 caracteres
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="material-icons text-xs">check_circle</span>
                                                Al menos una mayúscula
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="material-icons text-xs">check_circle</span>
                                                Al menos un número
                                            </li>
                                        </ul>
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
                                                <span>Restableciendo...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Restablecer contraseña</span>
                                                <span className="material-icons text-xl">check</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            /* Success State */
                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-icons text-5xl text-green-600 dark:text-green-400">
                                        check_circle
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    ¡Contraseña restablecida!
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-2">
                                    Tu contraseña ha sido actualizada exitosamente.
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                                    Serás redirigido al inicio de sesión en unos segundos...
                                </p>
                                <div className="flex justify-center">
                                    <svg className="animate-spin h-6 w-6 text-primary dark:text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {!success && (
                            /* Back to login link */
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                                <Link
                                    to="/iniciar-sesión"
                                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <span className="material-icons text-sm">arrow_back</span>
                                    Volver a iniciar sesión
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
