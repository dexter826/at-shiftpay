import React from 'react';
import { LogOut, Mail, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn, focusRingClasses } from '@/lib/utils';
import type { User } from 'firebase/auth';

interface VerificationViewProps {
  currentUser: User | null;
  loading: boolean;
  onCheckVerification: () => Promise<void>;
  onResendEmail: () => Promise<void>;
  onLogout: () => void;
}

const steps = [
  'Mở email xác thực đã gửi đến địa chỉ bên dưới.',
  'Nhấn vào liên kết xác thực trong email.',
  'Quay lại đây và chọn "Tôi đã xác thực".',
];

const VerificationView: React.FC<VerificationViewProps> = ({
  currentUser,
  loading,
  onCheckVerification,
  onResendEmail,
  onLogout,
}) => (
  <div>
    <div className="mb-5">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-sm bg-accent-soft text-accent-ink">
        <Mail size={20} aria-hidden="true" />
      </div>
      <h1 className="text-display text-ink">Xác thực email</h1>
      <p className="mt-1 text-body-sm text-ink-muted">
        Một bước nữa để hoàn tất tài khoản của bạn.
      </p>
    </div>

    <div className="mb-4 border border-line bg-surface px-3.5 py-3">
      <p className="font-mono text-mono-label text-ink-muted">Email đã gửi</p>
      <p className="mt-0.5 truncate text-body-sm font-medium text-ink">{currentUser?.email}</p>
    </div>

    <ol className="mb-5 space-y-2.5">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-2.5 text-body-sm text-ink-soft">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] text-ink-muted">
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>

    <div className="space-y-2">
      <Button
        onClick={onCheckVerification}
        fullWidth
        disabled={loading}
        aria-busy={loading || undefined}
      >
        {loading ? 'Đang kiểm tra...' : 'Tôi đã xác thực'}
      </Button>
      <Button
        variant="outline"
        onClick={onResendEmail}
        fullWidth
        disabled={loading}
        icon={<RefreshCw size={14} aria-hidden="true" />}
      >
        Gửi lại email
      </Button>
      <button
        type="button"
        onClick={onLogout}
        className={cn(
          'flex min-h-11 w-full items-center justify-center gap-1.5 rounded-sm text-body-sm font-medium text-ink-muted hover:text-ink',
          focusRingClasses
        )}
      >
        <LogOut size={13} aria-hidden="true" />
        Quay lại đăng nhập
      </button>
    </div>
  </div>
);

export default VerificationView;
