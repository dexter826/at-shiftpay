import React from 'react';
import { Lock, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { PasswordToggle } from '@/components/ui/PasswordToggle';
import { cn, focusRingClasses } from '@/lib/utils';
import { getInitials } from '@/utils/initials';

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
}) => (
  <div>
    <div className="mb-5">
      <h1 className="text-display text-ink">Đăng nhập</h1>
      <p className="mt-1 text-body-sm text-ink-muted">Tiếp tục với tài khoản đã lưu.</p>
    </div>

    <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-label font-semibold text-accent-ink">
        {getInitials(savedUser.displayName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-semibold text-ink">{savedUser.displayName}</p>
        <p className="truncate text-label text-ink-muted">{savedUser.email}</p>
      </div>
      <button
        type="button"
        onClick={onRemoveAccount}
        aria-label="Xóa tài khoản đã lưu"
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
          focusRingClasses
        )}
      >
        <X size={16} aria-hidden="true" />
      </button>
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
      <input
        type="text"
        name="username"
        value={savedUser.email}
        readOnly
        className="hidden"
        autoComplete="username"
      />

      <Field label="Mật khẩu" error={passwordError}>
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
          autoComplete="current-password"
          autoFocus
        />
      </Field>

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

      <Button type="submit" disabled={loading} fullWidth aria-busy={loading || undefined}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>

    <button
      type="button"
      onClick={onSwitchAccount}
      className={cn(
        'mx-auto mt-4 flex min-h-11 items-center justify-center rounded-sm text-body-sm text-ink-muted hover:text-ink',
        focusRingClasses
      )}
    >
      Đăng nhập tài khoản khác
    </button>
  </div>
);

export default QuickLoginView;
