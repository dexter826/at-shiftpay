import React from 'react';
import { ChevronLeft, Lock, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { PasswordToggle } from '@/components/ui/PasswordToggle';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { cn, focusRingClasses } from '@/lib/utils';
import type { SavedUser } from '@/stores/authStore';

interface AuthFormProps {
  isSignUp: boolean;
  savedUser: SavedUser | null;
  showQuickLogin: boolean;
  onBackToQuickLogin: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  googleLoading: boolean;
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
  onGoogleSignIn,
  googleLoading,
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
  return (
    <div>
      {!isSignUp && savedUser && !showQuickLogin && (
        <button
          type="button"
          onClick={onBackToQuickLogin}
          aria-label="Quay lại đăng nhập nhanh"
          className={cn(
            'mb-4 flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
            focusRingClasses
          )}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
      )}

      <div className="mb-4">
        <h1 className="text-display text-ink">{isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}</h1>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-body-sm text-danger"
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        {isSignUp && (
          <Field label="Họ và tên" error={fullNameError}>
            <Input
              leadingIcon={<User size={15} aria-hidden="true" />}
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                if (fullNameError) onValidateFullName(event.target.value);
              }}
              placeholder="Nguyễn Minh Anh"
              autoComplete="name"
              autoFocus
            />
          </Field>
        )}

        <Field label="Email" error={emailError}>
          <Input
            leadingIcon={<User size={15} aria-hidden="true" />}
            type="email"
            value={email}
            onChange={(event) => {
              onEmailChange(event.target.value);
              if (emailError) onValidateEmail(event.target.value);
            }}
            placeholder="anhthu@shiftpay.vn"
            autoComplete="email"
            autoFocus={!isSignUp}
          />
        </Field>

        <Field
          label="Mật khẩu"
          hint={isSignUp ? 'Ít nhất 6 ký tự.' : undefined}
          error={passwordError}
        >
          <Input
            leadingIcon={<Lock size={15} aria-hidden="true" />}
            trailingAction={
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              />
            }
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (passwordError) onValidatePassword(event.target.value);
            }}
            placeholder="••••••••"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />
        </Field>

        {isSignUp && (
          <Field label="Xác nhận mật khẩu" error={confirmPasswordError}>
            <Input
              leadingIcon={<Lock size={15} aria-hidden="true" />}
              trailingAction={
                <PasswordToggle
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                />
              }
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (confirmPasswordError) onValidateConfirmPassword(event.target.value);
              }}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </Field>
        )}

        {!isSignUp && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Checkbox checked={rememberMe} onChange={setRememberMe} label="Ghi nhớ đăng nhập" />
            <button
              type="button"
              onClick={onForgotPassword}
              className={cn(
                'min-h-9 rounded-sm text-label font-medium text-accent-ink hover:underline',
                focusRingClasses
              )}
            >
              Quên mật khẩu?
            </button>
          </div>
        )}

        <div className="space-y-2.5 pt-0.5">
          <Button
            type="submit"
            disabled={loading || googleLoading}
            fullWidth
            aria-busy={loading || undefined}
          >
            {loading ? 'Đang đăng nhập...' : isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
          </Button>

          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-line" />
            <span className="absolute bg-surface px-3 text-label text-ink-muted">hoặc</span>
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onGoogleSignIn}
            disabled={loading || googleLoading}
            loading={googleLoading}
            icon={<GoogleIcon size={18} />}
          >
            Đăng nhập bằng Google
          </Button>
        </div>
      </form>

      <div className="mt-3.5 text-center">
        <p className="text-body-sm text-ink-muted">
          {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            type="button"
            onClick={onSwitchMode}
            className={cn(
              'inline-flex items-center rounded-sm px-1 py-1 align-baseline font-medium text-accent-ink hover:underline',
              focusRingClasses
            )}
          >
            {isSignUp ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
