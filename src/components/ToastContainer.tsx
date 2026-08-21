import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let borderClass = 'border-emerald-200 bg-white text-slate-900 shadow-md';
          let iconColor = 'text-emerald-600';

          if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-rose-200 bg-white text-slate-900 shadow-md';
            iconColor = 'text-rose-600';
          } else if (toast.type === 'warning') {
            Icon = AlertCircle;
            borderClass = 'border-amber-200 bg-white text-slate-900 shadow-md';
            iconColor = 'text-amber-600';
          } else if (toast.type === 'info') {
            Icon = Info;
            borderClass = 'border-blue-200 bg-white text-slate-900 shadow-md';
            iconColor = 'text-blue-600';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Fermer"
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
