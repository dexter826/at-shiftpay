import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { focusRingClasses } from '@/lib/utils';
import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion';

type ToastType = 'success' | 'error' | 'warning';

interface Toast {
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

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: number) => void }> = ({
  toast,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const icons = {
    success: <CheckCircle size={18} className="text-success" />,
    error: <XCircle size={18} className="text-danger" />,
    warning: <AlertCircle size={18} className="text-warning" />,
  };

  const borderColors = {
    success: 'border-success/40',
    error: 'border-danger/40',
    warning: 'border-warning/40',
  };

  return (
    <motion.div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`flex items-center gap-3 px-4 py-3 rounded-md border bg-surface ${borderColors[toast.type]}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: DURATION_FAST, ease: EASE_STANDARD }}
      layout
    >
      {icons[toast.type]}
      <span className={`text-body-sm text-ink flex-1`}>{toast.message}</span>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        aria-label="Đóng thông báo"
        className={`p-1 rounded-xs text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingClasses}`}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(0);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration: number = 3000) => {
      nextIdRef.current += 1;
      const id = nextIdRef.current;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
