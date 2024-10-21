// my-website/components/ui/toast-context.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: string;
  title: string;
  description: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const newToast = { ...toast, id: Date.now().toString() };
    setToasts((prev) => [...prev, newToast]);

    // Automatically remove toast after 5 seconds
    setTimeout(() => removeToast(newToast.id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastList toasts={toasts} />
    </ToastContext.Provider>
  );
};

const ToastList = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed bottom-0 right-0 p-4">
    {toasts.map((toast) => (
      <div 
        key={toast.id} 
        className="bg-white shadow-md p-4 mb-2 rounded-md border border-black text-black"
      >
        <h4 className="font-bold">{toast.title}</h4>
        <p>{toast.description}</p>
      </div>
    ))}
  </div>
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
