import React from 'react';
import { ChevronLeft, Eye, EyeOff, Lock, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { cn, focusRingClasses } from '@/lib/utils';
import type { SavedUser } from '@/stores/authStore';

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

const PasswordToggle: React.FC<{
  visible: boolean;
  onToggle: () => void;
  label: string;
}> = ({ visible, onToggle, label }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={label}
    className={cn(
      'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:text-ink',
      focusRingClasses
    )}
  >
    {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
  </button>
);

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

      <div className="mb-5">
        <h1 className="text-display text-ink">{isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}</h1>
        <p className="mt-1 text-body-sm text-ink-muted">
          {isSignUp ? 'Bắt đầu quản lý ca làm và lương.' : 'Tiếp tục vào bảng ca của bạn.'}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-body-sm text-danger"
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
              onBlur={() => onValidateFullName(fullName)}
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
            onChange={(event) => onEmailChange(event.target.value)}
            onBlur={() => onValidateEmail(email)}
            placeholder="ten@gmail.com"
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
            onBlur={() => onValidatePassword(password)}
            placeholder="Nhập mật khẩu"
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
              onBlur={() => onValidateConfirmPassword(confirmPassword)}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
            />
          </Field>
        )}

        {!isSignUp && (
          <div className="flex flex-wrap items-center justify-between gap-x-2">
            <Checkbox checked={rememberMe} onChange={setRememberMe} label="Ghi nhớ đăng nhập" />
            <button
              type="button"
              onClick={onForgotPassword}
              className={cn(
                'min-h-11 rounded-sm text-label font-medium text-accent-ink hover:underline',
                focusRingClasses
              )}
            >
              Quên mật khẩu?
            </button>
          </div>
        )}

        <Button type="submit" disabled={loading} fullWidth aria-busy={loading || undefined}>
          {loading ? 'Đang đăng nhập...' : isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
        </Button>
      </form>

      <div className="mt-6 border-t border-line pt-4 text-center">
        <p className="text-body-sm text-ink-muted">
          {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            type="button"
            onClick={onSwitchMode}
            className={cn(
              'min-h-11 rounded-sm font-medium text-accent-ink hover:underline',
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
