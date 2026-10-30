import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { AlertCircle, CheckCircle, X, XCircle } from 'lucide-react';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning';

interface ToastRecord {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components -- the hook is intentionally co-located with its provider
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const toastStyles: Record<ToastType, { icon: React.ReactNode; border: string }> = {
  success: {
    icon: <CheckCircle size={18} className="text-success" aria-hidden="true" />,
    border: 'border-l-success',
  },
  error: {
    icon: <XCircle size={18} className="text-danger" aria-hidden="true" />,
    border: 'border-l-danger',
  },
  warning: {
    icon: <AlertCircle size={18} className="text-warning" aria-hidden="true" />,
    border: 'border-l-warning',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextIdRef = useRef(0);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration: number = 3000) => {
      nextIdRef.current += 1;
      const id = nextIdRef.current;
      setToasts((current) => [...current, { id, message, type, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastPrimitive.Viewport className="fixed left-1/2 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 outline-none">
          {toasts.map((toast) => {
            const styles = toastStyles[toast.type];
            return (
              <ToastPrimitive.Root
                key={toast.id}
                defaultOpen
                duration={toast.duration}
                type={toast.type === 'error' ? 'foreground' : 'background'}
                onOpenChange={(open) => {
                  if (!open) removeToast(toast.id);
                }}
                className={cn(
                  'pointer-events-auto flex w-full items-center gap-3 rounded-sm border border-line border-l-2 bg-surface p-3 pl-3.5',
                  'data-[state=open]:animate-toast-in',
                  'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
                  styles.border
                )}
              >
                <span>{styles.icon}</span>
                <ToastPrimitive.Title className="min-w-0 flex-1 text-body-sm text-ink">
                  {toast.message}
                </ToastPrimitive.Title>
                <ToastPrimitive.Close asChild>
                  <button
                    type="button"
                    aria-label="Đóng thông báo"
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
                      focusRingOnSurfaceClasses
                    )}
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </ToastPrimitive.Close>
              </ToastPrimitive.Root>
            );
          })}
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};
