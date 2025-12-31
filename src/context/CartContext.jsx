import { createContext, useContext, useState, useEffect } from 'react';
import { configAPI } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const toast = useToast();
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('eguva_cart');
        return localData ? JSON.parse(localData) : [];
    });

    const [shippingConfig, setShippingConfig] = useState({
        shipping_cost: 15.00,
        free_shipping_threshold: 70.00
    });

    useEffect(() => {
        const fetchShippingConfig = async () => {
            try {
                const response = await configAPI.getPublic();
                if (response.data.status === 'success') {
                    setShippingConfig(response.data.data);
                }
            } catch (error) {
                console.error('Error al cargar configuración de envío:', error);
            }
        };

        fetchShippingConfig();
    }, []);

    useEffect(() => {
        localStorage.setItem('eguva_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const newTotalQuantity = currentQuantity + quantity;

        // Validar contra el stock real del producto ANTES de actualizar estado
        if (newTotalQuantity > product.stock) {
            toast.info(`Solo quedan ${product.stock} unidades de este producto.`);
            return false;
        }

        setCartItems(prev => {
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newTotalQuantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        return true;
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;

        const item = cartItems.find(i => i.id === id);
        if (item && quantity > item.stock) {
            toast.info(`Solo quedan ${item.stock} unidades de este producto.`);
            return;
        }

        setCartItems(prev =>
            prev.map(item => item.id === id ? { ...item, quantity } : item)
        );
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);

    // Lógica de Envío Dinámica
    const isFreeShipping = cartTotal >= shippingConfig.free_shipping_threshold;
    const shippingCost = cartItems.length === 0 ? 0 : (isFreeShipping ? 0 : shippingConfig.shipping_cost);
    const remainingForFreeShipping = Math.max(0, shippingConfig.free_shipping_threshold - cartTotal);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            cartCount,
            cartTotal,
            shippingCost,
            isFreeShipping,
            remainingForFreeShipping,
            freeShippingThreshold: shippingConfig.free_shipping_threshold
        }}>
            {children}
        </CartContext.Provider>
    );
};
