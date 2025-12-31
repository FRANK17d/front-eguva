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

// Usuarios API
export const usuariosAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/users/lista${queryString ? `?${queryString}` : ''}`);
    },
    getProfile: () => api.get('/users/perfil'),
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

// Boletin API
export const boletinAPI = {
    suscribir: (correo) => api.post('/boletin/suscribir', { correo }),
    listar: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/boletin/lista${queryString ? `?${queryString}` : ''}`);
    }
};

// Pedidos API
export const pedidosAPI = {
    crear: (data) => api.post('/pedidos', data),
    getMisPedidos: () => api.get('/pedidos/mis-pedidos'),
    getById: (id) => api.get(`/pedidos/${id}`),
    // Admin
    getAdmin: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/pedidos/admin/lista${queryString ? `?${queryString}` : ''}`);
    },
    actualizarEstado: (id, estado) => api.put(`/pedidos/admin/${id}/estado`, { estado })
};

// Config API
export const configAPI = {
    getPublic: () => api.get('/config/public'),
    getAdmin: () => api.get('/config'),
    update: (data) => api.put('/config', data)
};

// Pagos API
export const pagosAPI = {
    crearPreferencia: (pedidoId) => api.post('/payments/create-preference', { pedidoId }),
    procesarPago: (paymentData) => api.post('/payments/process-payment', paymentData)
};

// Legacy - mantener compatibilidad
export const productsAPI = productosAPI;

export default api;
