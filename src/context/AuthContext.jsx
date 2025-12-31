import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await authAPI.getProfile();
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const register = async (userData) => {
        const response = await authAPI.register(userData);
        return response.data;
    };

    const logout = async () => {
        setIsLoggingOut(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggingOut(false);
    };

    const token = localStorage.getItem('token');

    const value = {
        user,
        token,
        loading,
        isLoggingOut,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.rol === 'administrador'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
