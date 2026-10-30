import React, { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { PasswordToggle } from '@/components/ui/PasswordToggle';
import { useToast } from '@/components/ui/ToastProvider';
import { auth } from '@/lib/firebase';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordErrors {
  current?: string;
  next?: string;
  confirm?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearError = (key: keyof PasswordErrors) => {
    if (errors[key]) setErrors((previous) => ({ ...previous, [key]: undefined }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const nextErrors: PasswordErrors = {};
    if (!currentPassword) nextErrors.current = 'Nhập mật khẩu hiện tại.';
    if (!newPassword) nextErrors.next = 'Nhập mật khẩu mới.';
    else if (newPassword.length < 6) nextErrors.next = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    if (newPassword !== confirmPassword) nextErrors.confirm = 'Mật khẩu xác nhận không khớp.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setFormError('');
    setLoading(true);

    const user = auth.currentUser;
    if (!user?.email) {
      setFormError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, currentPassword)
      );
      await updatePassword(user, newPassword);
      showToast('Đã đổi mật khẩu.', 'success');
      onClose();
    } catch (error) {
      const code = (error as { code?: string }).code;
      console.error('Change password error:', error);
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrors({ current: 'Mật khẩu hiện tại không đúng.' });
      } else if (code === 'auth/weak-password') {
        setErrors({ next: 'Mật khẩu mới quá yếu.' });
      } else if (code === 'auth/requires-recent-login') {
        setFormError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setFormError('Không thể đổi mật khẩu. Thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" form="change-password-form" className="flex-1" loading={loading}>
            Cập nhật
          </Button>
        </div>
      }
    >
      <form id="change-password-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input
          type="text"
          name="username"
          value={auth.currentUser?.email || ''}
          readOnly
          className="hidden"
          autoComplete="username"
        />

        {formError && (
          <div
            role="alert"
            className="rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-body-sm text-danger"
          >
            {formError}
          </div>
        )}

        <Field label="Mật khẩu hiện tại" error={errors.current}>
          <Input
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              clearError('current');
            }}
            trailingAction={
              <PasswordToggle
                visible={showCurrent}
                onToggle={() => setShowCurrent(!showCurrent)}
                label={showCurrent ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
              />
            }
            autoComplete="current-password"
          />
        </Field>

        <Field label="Mật khẩu mới" hint="Ít nhất 6 ký tự." error={errors.next}>
          <Input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              clearError('next');
            }}
            trailingAction={
              <PasswordToggle
                visible={showNew}
                onToggle={() => setShowNew(!showNew)}
                label={showNew ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
              />
            }
            autoComplete="new-password"
          />
        </Field>

        <Field label="Xác nhận mật khẩu mới" error={errors.confirm}>
          <Input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              clearError('confirm');
            }}
            trailingAction={
              <PasswordToggle
                visible={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
                label={showConfirm ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
              />
            }
            autoComplete="new-password"
          />
        </Field>
      </form>
    </Modal>
  );
};
