import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnline, setShowOnline] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnline(true);
      setTimeout(() => setShowOnline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const show = !isOnline || showOnline;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed left-0 right-0 top-0 z-[60] pt-safe md:left-[var(--rail-width)]"
          initial={{ y: prefersReducedMotion ? 0 : -32 }}
          animate={{ y: 0 }}
          exit={{ y: prefersReducedMotion ? 0 : -32 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="flex items-center justify-center gap-2 border-b border-line bg-surface px-4 py-1.5">
            {isOnline ? (
              <Wifi size={14} aria-hidden="true" className="text-success" />
            ) : (
              <WifiOff size={14} aria-hidden="true" className="text-danger" />
            )}
            <span className="font-mono text-mono-label text-ink-muted">
              {isOnline ? 'Đã kết nối lại' : 'Đang ngoại tuyến — dữ liệu có thể chưa được cập nhật'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
