import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Lock, Eye, EyeOff, X, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { ValidationError } from '@/features/auth/components/login/ValidationError';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { DURATION_BASE, EASE_STANDARD } from '@/lib/motion';

interface QuickLoginViewProps {
  savedUser: { email: string; displayName: string; photoURL?: string };
  onRemoveAccount: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSwitchAccount: () => void;
  onForgotPassword: () => void;
  password: string;
  setPassword: (value: string) => void;
  passwordError: string;
  onValidatePassword: (value: string) => boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error: string;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  loading: boolean;
}

const QuickLoginView: React.FC<QuickLoginViewProps> = ({
  savedUser,
  onRemoveAccount,
  onSubmit,
  onSwitchAccount,
  onForgotPassword,
  password,
  setPassword,
  passwordError,
  onValidatePassword,
  showPassword,
  setShowPassword,
  error,
  rememberMe,
  setRememberMe,
  loading,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: shouldReduceMotion ? 0 : DURATION_BASE, ease: EASE_STANDARD };
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={transition}
      className="flex flex-col items-center text-center space-y-5"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full border border-line bg-surface-2 overflow-hidden">
          <img
            src={savedUser.photoURL || '/avatar.png'}
            alt={savedUser.displayName}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          type="button"
          onClick={onRemoveAccount}
          aria-label="Xóa tài khoản đã lưu"
          className={`absolute -top-2 -right-6 flex h-10 w-10 items-center justify-center bg-surface border border-line hover:bg-surface-2 text-ink-muted hover:text-ink rounded-sm transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
        >
          <X size={12} />
        </button>
      </div>

      <div>
        <h2 className="text-display font-semibold text-ink">Xin chào!</h2>
        <p className="text-body-sm text-ink-soft mt-0.5 break-words">{savedUser.displayName}</p>
        <p className="text-body-sm text-ink-muted mt-0.5 break-all">{savedUser.email}</p>
      </div>

      <form onSubmit={onSubmit} className="w-full space-y-3">
        <input
          type="text"
          name="username"
          value={savedUser.email}
          readOnly
          className="hidden"
          autoComplete="username"
        />
        <div className="text-left space-y-1">
          <div className="relative">
            <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              aria-label="Mật khẩu"
              aria-invalid={!!passwordError}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) onValidatePassword(e.target.value);
              }}
              className={`w-full min-h-10 bg-surface-2 pl-9 pr-11 py-2 rounded-sm border text-body-sm transition-colors duration-fast ease-standard ${passwordError ? 'border-danger' : 'border-ink-muted hover:border-ink'} text-ink placeholder:text-ink-muted ${focusRingOnSurfaceClasses}`}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <ValidationError message={passwordError} />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={transition}
              className="overflow-hidden"
            >
              <div
                role="alert"
                className="p-3 bg-surface-2 border border-danger rounded-sm text-body-sm text-ink"
              >
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-x-2 pt-1">
          <Checkbox checked={rememberMe} onChange={setRememberMe} label="Ghi nhớ" />
          <button
            type="button"
            onClick={onForgotPassword}
            className={`min-h-10 rounded-sm text-label text-accent-ink hover:underline font-medium ${focusRingOnSurfaceClasses}`}
          >
            Quên mật khẩu?
          </button>
        </div>

        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'Đang đăng nhập...' : 'Tiếp tục'}
        </Button>

        <button
          type="button"
          onClick={onSwitchAccount}
          className={`min-h-10 rounded-sm text-body-sm text-ink-muted hover:text-ink transition-colors duration-fast ease-standard flex items-center justify-center gap-1 mx-auto ${focusRingOnSurfaceClasses}`}
        >
          <span>Đăng nhập tài khoản khác</span>
          <ChevronRight size={12} />
        </button>
      </form>
    </motion.div>
  );
};

export default QuickLoginView;
