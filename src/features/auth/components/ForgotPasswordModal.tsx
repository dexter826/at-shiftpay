import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const close = () => {
    setEmail('');
    setError('');
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Nhập email để nhận liên kết đặt lại mật khẩu.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmed);
      showToast('Đã gửi email đặt lại mật khẩu.', 'success');
      close();
    } catch (caught) {
      const code = (caught as { code?: string }).code;
      setError(
        code === 'auth/invalid-email'
          ? 'Email không hợp lệ.'
          : 'Không thể gửi email đặt lại mật khẩu. Thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đặt lại mật khẩu"
      isOpen={isOpen}
      onClose={close}
      footer={
        <Button
          type="submit"
          form="forgot-password-form"
          disabled={loading}
          fullWidth
          aria-busy={loading || undefined}
        >
          {loading ? 'Đang gửi...' : 'Gửi liên kết'}
        </Button>
      }
    >
      <form id="forgot-password-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <p className="text-body-sm text-ink-muted">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <Field label="Email" error={error}>
          <Input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError('');
            }}
            placeholder="ten@gmail.com"
            autoComplete="email"
            autoFocus
          />
        </Field>
      </form>
    </Modal>
  );
};
