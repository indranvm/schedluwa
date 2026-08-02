"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastItemProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(toast.id), 300);
    }, 3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, onClose]);

  const config = {
    success: {
      icon: <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />,
      bg: "bg-white border-emerald-200",
      bar: "bg-emerald-500",
    },
    error: {
      icon: <XCircle className="w-4 h-4 text-red-500 shrink-0" />,
      bg: "bg-white border-red-200",
      bar: "bg-red-500",
    },
    info: {
      icon: <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />,
      bg: "bg-white border-blue-200",
      bar: "bg-blue-500",
    },
  }[toast.type];

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-[360px] overflow-hidden transition-all duration-300 ${config.bg} ${
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      {config.icon}
      <p className="text-sm text-slate-700 font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onClose(toast.id), 300);
        }}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${config.bar} animate-shrink`}
        style={{ animationDuration: "3.5s" }}
      />
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Hook untuk menggunakan toast
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (message: string, type: ToastType = "success") => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error"),
    info: (message: string) => addToast(message, "info"),
  };

  return { toasts, toast, removeToast };
}
