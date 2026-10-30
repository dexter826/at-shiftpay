import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { Loader2 } from 'lucide-react';
import { focusRingOnSurfaceClasses } from '@/lib/utils';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Vui lòng nhập email', 'error');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showToast('Đã gửi email đặt lại mật khẩu', 'success');
      onClose();
      setEmail('');
    } catch (error) {
      const code = (error as { code?: string }).code;
      console.error('Reset password error:', error);
      let message = 'Có lỗi xảy ra khi gửi email';
      if (code === 'auth/invalid-email') {
        message = 'Email không hợp lệ';
      }
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Quên mật khẩu"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <Button onClick={handleSubmit} disabled={loading} fullWidth>
          {loading && <Loader2 size={16} className="animate-spin" />}
          Gửi yêu cầu
        </Button>
      }
    >
      <div className="space-y-4">
        <p className={`text-body-sm text-ink-soft`}>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <div>
          <label
            htmlFor="reset-password-email"
            className={`block text-label font-medium text-ink-muted mb-1.5`}
          >
            Email
          </label>
          <input
            id="reset-password-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            autoComplete="email"
            className={`w-full min-h-10 p-2.5 rounded-sm border bg-surface-2 border-ink-muted hover:border-ink text-body-sm text-ink placeholder:text-ink-muted ${focusRingOnSurfaceClasses}`}
          />
        </div>
      </div>
    </Modal>
  );
};
