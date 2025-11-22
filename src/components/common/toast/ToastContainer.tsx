import { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastType } from './index';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op function if context is not available (safer fallback)
    console.warn('useToast must be used within ToastProvider. Using no-op fallback.');
    return {
      showToast: (message: string, type?: ToastType) => {
        console.log(`Toast (${type || 'info'}):`, message);
      }
    };
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    try {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { id, message, type }]);
    } catch (error) {
      console.error('Failed to show toast:', error);
    }
  };

  const removeToast = (id: string) => {
    try {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    } catch (error) {
      console.error('Failed to remove toast:', error);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
