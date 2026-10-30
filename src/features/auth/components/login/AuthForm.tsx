import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { ValidationError } from '@/features/auth/components/login/ValidationError';
import type { SavedUser } from '@/stores/authStore';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { DURATION_BASE, EASE_STANDARD } from '@/lib/motion';

interface AuthFormProps {
  isSignUp: boolean;
  savedUser: SavedUser | null;
  showQuickLogin: boolean;
  onBackToQuickLogin: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  email: string;
  onEmailChange: (value: string) => void;
  onValidateEmail: (value: string) => boolean;
  emailError: string;
  fullName: string;
  setFullName: (value: string) => void;
  fullNameError: string;
  onValidateFullName: (value: string) => boolean;
  password: string;
  setPassword: (value: string) => void;
  passwordError: string;
  onValidatePassword: (value: string) => boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  confirmPasswordError: string;
  onValidateConfirmPassword: (value: string) => boolean;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  onForgotPassword: () => void;
  error: string;
  loading: boolean;
  onSwitchMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSignUp,
  savedUser,
  showQuickLogin,
  onBackToQuickLogin,
  onSubmit,
  email,
  onEmailChange,
  onValidateEmail,
  emailError,
  fullName,
  setFullName,
  fullNameError,
  onValidateFullName,
  password,
  setPassword,
  passwordError,
  onValidatePassword,
  showPassword,
  setShowPassword,
  confirmPassword,
  setConfirmPassword,
  confirmPasswordError,
  onValidateConfirmPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  rememberMe,
  setRememberMe,
  onForgotPassword,
  error,
  loading,
  onSwitchMode,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: shouldReduceMotion ? 0 : DURATION_BASE, ease: EASE_STANDARD };
  const inputClass = (hasError: boolean) =>
    `w-full min-h-10 bg-surface-2 pl-9 pr-11 py-2 rounded-sm border text-body-sm transition-colors duration-fast ease-standard ${
      hasError ? 'border-danger' : 'border-ink-muted hover:border-ink'
    } text-ink placeholder:text-ink-muted ${focusRingOnSurfaceClasses}`;

  return (
    <motion.div
      key={isSignUp ? 'signup-form' : 'login-form'}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      {!isSignUp && savedUser && !showQuickLogin && (
        <button
          type="button"
          onClick={onBackToQuickLogin}
          aria-label="Quay lại đăng nhập nhanh"
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <h2 className="text-display font-semibold text-ink text-center mb-5">
        {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
      </h2>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden mb-3"
          >
            <div
              role="alert"
              className="p-3 bg-surface-2 border border-danger rounded-sm text-body-sm text-ink text-center"
            >
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="auth-email" className="text-label font-medium text-ink-muted ml-1">
            Email
          </label>
          <div className="relative">
            <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              id="auth-email"
              aria-invalid={!!emailError}
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onBlur={() => onValidateEmail(email)}
              className={inputClass(!!emailError)}
              placeholder="Nhập email"
              autoComplete="email"
            />
          </div>
          <ValidationError message={emailError} />
        </div>

        {isSignUp && (
          <div className="space-y-1">
            <label htmlFor="auth-full-name" className="text-label font-medium text-ink-muted ml-1">
              Họ và tên
            </label>
            <div className="relative">
              <User
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                id="auth-full-name"
                aria-invalid={!!fullNameError}
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fullNameError) onValidateFullName(e.target.value);
                }}
                onBlur={() => onValidateFullName(fullName)}
                className={inputClass(!!fullNameError)}
                placeholder="Nhập họ tên"
                autoComplete="name"
              />
            </div>
            <ValidationError message={fullNameError} />
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="auth-password" className="text-label font-medium text-ink-muted ml-1">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              id="auth-password"
              aria-invalid={!!passwordError}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) onValidatePassword(e.target.value);
              }}
              onBlur={() => onValidatePassword(password)}
              className={inputClass(!!passwordError)}
              placeholder="Nhập mật khẩu"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted hover:text-ink transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <ValidationError message={passwordError} />
        </div>

        {isSignUp && (
          <div className="space-y-1">
            <label
              htmlFor="auth-confirm-password"
              className="text-label font-medium text-ink-muted ml-1"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                id="auth-confirm-password"
                aria-invalid={!!confirmPasswordError}
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) onValidateConfirmPassword(e.target.value);
                }}
                onBlur={() => onValidateConfirmPassword(confirmPassword)}
                className={inputClass(!!confirmPasswordError)}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                className="absolute right-0.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted hover:text-ink transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <ValidationError message={confirmPasswordError} />
          </div>
        )}

        {!isSignUp && (
          <div className="flex flex-wrap items-center justify-between gap-x-2 pt-1">
            <Checkbox checked={rememberMe} onChange={setRememberMe} label="Ghi nhớ đăng nhập" />
            <button
              type="button"
              onClick={onForgotPassword}
              className={`min-h-10 rounded-sm text-label text-accent-ink hover:underline font-medium ${focusRingOnSurfaceClasses}`}
            >
              Quên mật khẩu?
            </button>
          </div>
        )}

        <Button type="submit" disabled={loading} fullWidth className="mt-1">
          {loading ? 'Đang xử lý...' : isSignUp ? 'Đăng ký' : 'Đăng nhập'}
        </Button>
      </form>

      <div className="mt-5 pt-4 border-t border-line text-center">
        <p className="text-body-sm text-ink-muted mb-2">
          {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
        </p>
        <button
          type="button"
          onClick={onSwitchMode}
          className={`min-h-10 rounded-sm text-accent-ink hover:underline text-body-sm font-medium ${focusRingOnSurfaceClasses}`}
        >
          {isSignUp ? 'Đăng nhập ngay' : 'Tạo tài khoản mới'}
        </button>
      </div>
    </motion.div>
  );
};

export default AuthForm;
