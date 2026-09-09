import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const config = {
    success: { icon: CheckCircle2, className: 'bg-primary-fixed text-on-primary-fixed border border-primary/20' },
    error: { icon: AlertCircle, className: 'bg-error-container text-on-error-container border border-error/20' },
    info: { icon: Info, className: 'bg-surface-container-high text-on-surface border border-outline-variant' }
  };
  const { icon: Icon, className } = config[toast.type] || config.info;

  return (
    <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg animate-in slide-in-from-right-8 fade-in duration-300 ${className}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-semibold">{toast.message}</p>
      <button 
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
