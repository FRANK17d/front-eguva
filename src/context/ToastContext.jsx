import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast debe ser usado dentro de un ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmModal, setConfirmModal] = useState(null);

    // Toast functions
    const addToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message) => addToast(message, 'success'), [addToast]);
    const error = useCallback((message) => addToast(message, 'error'), [addToast]);
    const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);
    const info = useCallback((message) => addToast(message, 'info'), [addToast]);

    // Confirm dialog function
    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfirmModal({
                title: options.title || '¿Estás seguro?',
                message: options.message || 'Esta acción no se puede deshacer.',
                confirmText: options.confirmText || 'Eliminar',
                cancelText: options.cancelText || 'Cancelar',
                type: options.type || 'danger',
                onConfirm: () => {
                    setConfirmModal(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmModal(null);
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <ToastContext.Provider value={{ success, error, warning, info, removeToast, confirm }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            {confirmModal && <ConfirmModal {...confirmModal} />}
        </ToastContext.Provider>
    );
};

// Toast Container Component
function ToastContainer({ toasts, removeToast }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

// Individual Toast Component
function Toast({ toast, onClose }) {
    const { message, type } = toast;

    const styles = {
        success: {
            bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
            icon: 'check_circle',
        },
        error: {
            bg: 'bg-gradient-to-r from-red-500 to-rose-600',
            icon: 'error',
        },
        warning: {
            bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
            icon: 'warning',
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
            icon: 'info',
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div
            className={`${style.bg} text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto animate-slide-in-right backdrop-blur-sm`}
            role="alert"
        >
            <div className="bg-white/20 p-2 rounded-xl">
                <span className="material-icons text-xl">{style.icon}</span>
            </div>
            <p className="flex-1 font-medium text-sm">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar"
            >
                <span className="material-icons text-lg">close</span>
            </button>
        </div>
    );
}

// Confirm Modal Component
function ConfirmModal({ title, message, confirmText, cancelText, type, onConfirm, onCancel }) {
    const buttonStyles = {
        danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
        warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
        info: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    };

    const iconStyles = {
        danger: { bg: 'bg-red-100 dark:bg-red-900/30', icon: 'delete', color: 'text-red-600 dark:text-red-400' },
        warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'warning', color: 'text-yellow-600 dark:text-yellow-400' },
        info: { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'info', color: 'text-blue-600 dark:text-blue-400' },
    };

    const buttonStyle = buttonStyles[type] || buttonStyles.danger;
    const iconStyle = iconStyles[type] || iconStyles.danger;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
                {/* Icon Header */}
                <div className="pt-8 pb-4 px-6 text-center">
                    <div className={`w-16 h-16 ${iconStyle.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <span className={`material-icons text-3xl ${iconStyle.color}`}>{iconStyle.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-6 py-3 ${buttonStyle} text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ToastProvider;
