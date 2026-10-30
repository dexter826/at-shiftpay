import React, { useState } from 'react';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { auth } from '@/lib/firebase';
import { settingsService } from '@/lib/api/settingsService';
import { useAuthStore } from '@/stores/authStore';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REQUIRED_CONFIRM_TEXT = 'XÓA TÀI KHOẢN';

const messageForDeleteError = (code?: string): string => {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Mật khẩu không đúng.';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần thử. Đợi một lúc rồi thử lại.';
    case 'auth/requires-recent-login':
      return 'Phiên đăng nhập đã cũ. Đăng xuất và đăng nhập lại.';
    default:
      return 'Không thể xóa tài khoản. Thử lại.';
  }
};

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const clearSavedUserInfo = useAuthStore((state) => state.clearSavedUserInfo);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete =
    confirmText.trim().toUpperCase() === REQUIRED_CONFIRM_TEXT && password.length > 0;
  const confirmError =
    confirmText.length > 0 && confirmText.trim().toUpperCase() !== REQUIRED_CONFIRM_TEXT
      ? 'Cụm từ xác nhận chưa đúng.'
      : undefined;

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;

    setIsDeleting(true);
    setPasswordError('');
    setFormError('');

    try {
      const user = auth.currentUser;
      if (!user?.email) throw new Error('Không tìm thấy người dùng');

      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
      await settingsService.deleteUserAccountData(user.uid);
      await deleteUser(user);
      clearSavedUserInfo();
      showToast('Tài khoản đã được xóa.', 'success');
    } catch (error) {
      const code = (error as { code?: string }).code;
      console.error('Delete account failed:', code ?? 'unknown');
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPasswordError(messageForDeleteError(code));
      } else {
        setFormError(messageForDeleteError(code));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      title="Xóa tài khoản?"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="delete-account-form"
            variant="danger"
            className="flex-1"
            loading={isDeleting}
            disabled={!canDelete}
          >
            Xóa tài khoản
          </Button>
        </div>
      }
    >
      <form
        id="delete-account-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleDelete();
        }}
        className="space-y-4"
        noValidate
      >
        <div className="flex items-start gap-2 border border-danger/30 bg-danger/5 px-3 py-2.5">
          <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-danger" />
          <p className="text-body-sm text-ink">
            Toàn bộ dữ liệu sẽ bị xóa vĩnh viễn. Không thể hoàn tác.
          </p>
        </div>

        <p className="text-body-sm leading-relaxed text-ink-soft">
          Dữ liệu nhân viên, địa điểm, sự kiện, ca làm, thanh toán và cài đặt sẽ bị xóa. Tệp ảnh tải
          lên không được xóa tự động.
        </p>

        {formError && (
          <div
            role="alert"
            className="rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-body-sm text-danger"
          >
            {formError}
          </div>
        )}

        <Field
          label={`Gõ ${REQUIRED_CONFIRM_TEXT} để xác nhận`}
          hint="Không phân biệt chữ hoa, chữ thường."
          error={confirmError}
        >
          <Input
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value.toUpperCase())}
            placeholder={REQUIRED_CONFIRM_TEXT}
            autoComplete="off"
            autoFocus
          />
        </Field>

        <Field
          label="Mật khẩu hiện tại"
          hint="Cần xác thực lại mật khẩu trước khi xóa."
          error={passwordError}
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (passwordError) setPasswordError('');
            }}
            trailingAction={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:text-ink',
                  focusRingOnSurfaceClasses
                )}
              >
                {showPassword ? (
                  <EyeOff size={16} aria-hidden="true" />
                ) : (
                  <Eye size={16} aria-hidden="true" />
                )}
              </button>
            }
            autoComplete="current-password"
          />
        </Field>
      </form>
    </Modal>
  );
};
