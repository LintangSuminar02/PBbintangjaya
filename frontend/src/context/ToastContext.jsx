import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto min-w-[320px] max-w-md bg-white rounded-2xl shadow-2xl shadow-black/10 border p-4 flex items-start gap-4 overflow-hidden relative group ${
                toast.type === 'success' ? 'border-emerald-100' : 
                toast.type === 'error' ? 'border-rose-100' : 'border-blue-100'
              }`}
            >
              {/* Progress Bar */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${
                  toast.type === 'success' ? 'bg-emerald-500' : 
                  toast.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                }`}
              />

              <div className={`mt-0.5 rounded-full p-1 ${
                toast.type === 'success' ? 'text-emerald-500 bg-emerald-50' : 
                toast.type === 'error' ? 'text-rose-500 bg-rose-50' : 'text-blue-500 bg-blue-50'
              }`}>
                {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
                 toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1 pr-4">
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">
                  {toast.type === 'success' ? 'Berhasil' : toast.type === 'error' ? 'Gagal' : 'Informasi'}
                </p>
                <p className="text-sm font-bold text-zinc-700 leading-snug">
                  {toast.message}
                </p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="text-zinc-300 hover:text-zinc-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
