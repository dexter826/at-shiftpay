import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, RefreshCw, LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { User } from 'firebase/auth';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { DURATION_BASE, EASE_STANDARD } from '@/lib/motion';

interface VerificationViewProps {
  currentUser: User | null;
  loading: boolean;
  onCheckVerification: () => Promise<void>;
  onResendEmail: () => Promise<void>;
  onLogout: () => void;
}

const VerificationView: React.FC<VerificationViewProps> = ({
  currentUser,
  loading,
  onCheckVerification,
  onResendEmail,
  onLogout,
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: shouldReduceMotion ? 0 : DURATION_BASE, ease: EASE_STANDARD }}
      className="flex flex-col items-center text-center space-y-5"
    >
      <div className="w-16 h-16 bg-surface-2 border border-line rounded-md flex items-center justify-center text-ink-muted">
        <Mail size={32} />
      </div>

      <div>
        <h2 className="text-display font-semibold text-ink mb-1">Xác thực Email</h2>
        <p className="text-body-sm text-ink-soft">Email xác thực đã gửi đến:</p>
        <p className="text-body-sm font-semibold text-ink mt-0.5 break-all">{currentUser?.email}</p>
      </div>

      <div className="p-3 bg-surface-2 border border-line rounded-md w-full space-y-2 text-left">
        <p className="text-body-sm text-ink-muted flex items-start gap-2">
          <span className="text-ink-muted mt-0.5">•</span> Kiểm tra hộp thư đến (hoặc thư rác)
        </p>
        <p className="text-body-sm text-ink-muted flex items-start gap-2">
          <span className="text-ink-muted mt-0.5">•</span> Nhấn vào đường link trong email để xác
          nhận
        </p>
      </div>

      <div className="w-full space-y-2">
        <Button onClick={onCheckVerification} fullWidth disabled={loading}>
          {loading ? <RefreshCw className="animate-spin" size={16} /> : null}
          Tôi đã xác thực
        </Button>

        <button
          type="button"
          onClick={onResendEmail}
          disabled={loading}
          className={`w-full min-h-10 py-2 rounded-sm text-body-sm font-medium text-ink-muted hover:text-ink transition-colors duration-fast ease-standard flex items-center justify-center gap-1 disabled:opacity-60 ${focusRingOnSurfaceClasses}`}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Gửi lại email
        </button>

        <button
          type="button"
          onClick={onLogout}
          className={`w-full min-h-10 py-2 rounded-sm text-body-sm font-medium text-ink-muted hover:text-ink transition-colors duration-fast ease-standard flex items-center justify-center gap-1 border-t border-dashed border-line mt-2 pt-3 ${focusRingOnSurfaceClasses}`}
        >
          <LogOut size={12} /> Quay lại đăng nhập
        </button>
      </div>
    </motion.div>
  );
};

export default VerificationView;
