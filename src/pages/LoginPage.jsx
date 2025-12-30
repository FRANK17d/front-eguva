import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchemas';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            await login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
    };

    return (
        <>
            <SEO
                title="Iniciar Sesión | Eguva"
                description="Inicia sesión en Eguva para acceder a tu cuenta y gestionar tus compras de ropa de segunda mano."
                keywords="login eguva, iniciar sesión eguva, acceso cuenta eguva"
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
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Bienvenido de nuevo
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Inicia sesión para continuar
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
                                <span className="material-icons text-sm">error</span>
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Google Login Button */}
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 mb-6 group cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                Continuar con Google
                            </span>
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white dark:bg-card-dark px-4 text-gray-400">
                                    o inicia sesión con tu correo
                                </span>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.correo ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent transition-all duration-300`}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                {errors.correo && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <span className="material-icons text-sm">error</span>
                                        {errors.correo.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Contraseña
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
                                        placeholder="Tu contraseña"
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

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <Link
                                    to="/recuperar-contraseña"
                                    className="text-sm font-medium text-primary dark:text-white hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
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
                                        <span>Iniciando sesión...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Iniciar sesión</span>
                                        <span className="material-icons text-xl">login</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register link */}
                        <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
                            ¿No tienes cuenta?{' '}
                            <Link
                                to="/registro"
                                className="font-bold text-primary dark:text-white hover:underline"
                            >
                                Regístrate
                            </Link>
                        </p>
                    </div>

                    {/* Back to home */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors"
                        >
                            <span className="material-icons text-sm">arrow_back</span>
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
