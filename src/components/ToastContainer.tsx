import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map(toast => {
          let bg = 'bg-white text-slate-800 border-slate-200 shadow-lg';
          let icon = <Info className="w-5 h-5 text-sky-600 shrink-0" />;

          if (toast.type === 'success') {
            bg = 'bg-white text-slate-800 border-emerald-300 shadow-lg ring-1 ring-emerald-100';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
          } else if (toast.type === 'error') {
            bg = 'bg-white text-slate-800 border-rose-300 shadow-lg ring-1 ring-rose-100';
            icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-white text-slate-800 border-amber-300 shadow-lg ring-1 ring-amber-100';
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto rounded-xl border p-4 backdrop-blur-md flex items-start gap-3 ${bg}`}
              id={`toast-${toast.id}`}
            >
              {icon}
              <div className="flex-1 text-sm">
                <div className="font-bold text-slate-900">{toast.title}</div>
                {toast.message && (
                  <div className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md"
                aria-label="關閉"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
