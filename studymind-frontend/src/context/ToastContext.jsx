import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  // Affiche un toast. type = "success" | "error"
  const show = useCallback(
    (message, type = "success") => {
      const id = nextId++;
      setToasts((list) => [...list, { id, message, type }]);
      // Disparait automatiquement au bout de 3,5 s.
      setTimeout(() => remove(id), 3500);
    },
    [remove]
  );

  const toast = {
    success: (message) => show(message, "success"),
    error: (message) => show(message, "error"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => {
        const success = t.type === "success";
        const Icon = success ? CheckCircle2 : AlertCircle;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm shadow-lg ring-1 ${
              success
                ? "bg-white text-slate-800 ring-emerald-200"
                : "bg-white text-slate-800 ring-rose-200"
            }`}
            style={{ minWidth: 260, maxWidth: 360 }}
          >
            <Icon
              size={18}
              className={success ? "text-emerald-500" : "text-rose-500"}
            />
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => onClose(t.id)}
              className="text-slate-400 transition hover:text-slate-600"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  // Repli silencieux si le provider n'est pas monte (evite un crash).
  if (!ctx) {
    return { success: () => {}, error: () => {} };
  }
  return ctx;
}
