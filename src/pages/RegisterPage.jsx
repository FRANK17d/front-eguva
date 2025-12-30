import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthLabels = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Ingresa un correo electrónico válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);

        // TODO: Implementar lógica real de registro
        console.log('Register submitted:', formData);
    };

    const handleGoogleRegister = () => {
        // TODO: Implementar registro con Google
        console.log('Google register clicked');
    };

    return (
        <>
            <SEO
                title="Crear Cuenta | Eguva"
                description="Crea tu cuenta en Eguva para comprar ropa de segunda mano, guardar favoritos y recibir ofertas exclusivas."
                keywords="registro eguva, crear cuenta eguva, registrarse ropa segunda mano"
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
                                Crea tu cuenta
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Únete a nuestra comunidad de moda sostenible
                            </p>
                        </div>

                        {/* Google Register Button */}
                        <button
                            onClick={handleGoogleRegister}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 mb-6 group cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                Registrarse con Google
                            </span>
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white dark:bg-card-dark px-4 text-gray-400">
                                    o regístrate con tu correo
                                </span>
                            </div>
                        </div>

                        {/* Register Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre completo
                                </label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        person
                                    </span>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent transition-all duration-300`}
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <span className="material-icons text-sm">error</span>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        email
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent transition-all duration-300`}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <span className="material-icons text-sm">error</span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        lock
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent transition-all duration-300`}
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
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200 dark:bg-gray-700'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${strengthColors[passwordStrength].replace('bg-', 'text-')}`}>
                                            Seguridad: {strengthLabels[passwordStrength]}
                                        </p>
                                    </div>
                                )}
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <span className="material-icons text-sm">error</span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        lock_outline
                                    </span>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent transition-all duration-300`}
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
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <p className="mt-1 text-sm text-green-500 flex items-center gap-1">
                                        <span className="material-icons text-sm">check_circle</span>
                                        Las contraseñas coinciden
                                    </p>
                                )}
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <span className="material-icons text-sm">error</span>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-900 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Acepto los{' '}
                                        <Link to="/terminos" className="text-primary dark:text-white hover:underline font-medium">
                                            términos y condiciones
                                        </Link>
                                        {' '}y la{' '}
                                        <Link to="/privacidad" className="text-primary dark:text-white hover:underline font-medium">
                                            política de privacidad
                                        </Link>
                                    </span>
                                </label>
                                {errors.acceptTerms && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <span className="material-icons text-sm">error</span>
                                        {errors.acceptTerms}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-6"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Creando cuenta...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Crear cuenta</span>
                                        <span className="material-icons text-xl">person_add</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login link */}
                        <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                to="/iniciar-sesión"
                                className="font-bold text-primary dark:text-white hover:underline"
                            >
                                Inicia sesión
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
