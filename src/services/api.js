import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/users/perfil'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password })
};

// Categorías API
export const categoriasAPI = {
    // Públicas
    getAll: () => api.get('/categorias'),
    getById: (id) => api.get(`/categorias/${id}`),
    getBySlug: (slug) => api.get(`/categorias/${slug}`),

    // Admin (requieren autenticación)
    create: (data) => api.post('/categorias', data),
    update: (id, data) => api.put(`/categorias/${id}`, data),
    delete: (id) => api.delete(`/categorias/${id}`)
};

// Productos API
export const productosAPI = {
    // Públicas
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/productos${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => api.get(`/productos/${id}`),
    getBySlug: (slug) => api.get(`/productos/${slug}`),
    getDestacados: (limite = 8) => api.get(`/productos/destacados?limite=${limite}`),

    // Admin (requieren autenticación)
    getAdmin: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/productos/admin/lista${queryString ? `?${queryString}` : ''}`);
    },
    create: (data) => api.post('/productos', data),
    update: (id, data) => api.put(`/productos/${id}`, data),
    delete: (id) => api.delete(`/productos/${id}`)
};

// Legacy - mantener compatibilidad
export const productsAPI = productosAPI;

export default api;
