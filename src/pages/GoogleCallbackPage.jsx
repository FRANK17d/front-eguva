import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GoogleCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Guardar el token
            localStorage.setItem('token', token);

            // Verificar el perfil del usuario
            fetch(`${import.meta.env.VITE_API_URL}/users/perfil`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(user => {
                    // Actualizar el estado global
                    window.location.href = '/';
                })
                .catch(() => {
                    navigate('/iniciar-sesión');
                });
        } else {
            navigate('/iniciar-sesión');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-primary dark:text-white mx-auto mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">Iniciando sesión con Google...</p>
            </div>
        </div>
    );
}
