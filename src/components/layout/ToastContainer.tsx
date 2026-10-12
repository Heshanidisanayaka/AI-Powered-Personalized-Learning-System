import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="h-4 w-4 text-brand-600 shrink-0" />;
        let borderColor = 'border-brand-200 bg-brand-50/90';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />;
          borderColor = 'border-emerald-200 bg-emerald-50/90';
        } else if (toast.type === 'warning' || toast.type === 'error') {
          icon = <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />;
          borderColor = 'border-amber-200 bg-amber-50/90';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-2xl border ${borderColor} p-3.5 shadow-lg backdrop-blur-md animate-in slide-in-from-right duration-200`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">{icon}</div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
                {toast.description && (
                  <p className="mt-0.5 text-[11px] text-slate-600 leading-snug">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
