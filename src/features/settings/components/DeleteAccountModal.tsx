import React, { useState } from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { settingsService } from '@/lib/api/settingsService';
import { auth } from '@/lib/firebase';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/authStore';
import { focusRingOnSurfaceClasses } from '@/lib/utils';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REQUIRED_CONFIRM_TEXT = 'XÓA TÀI KHOẢN';

function messageForDeleteError(code?: string): string {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Mật khẩu không đúng';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần thử. Vui lòng đợi một lúc rồi thử lại';
    case 'auth/requires-recent-login':
      return 'Phiên đăng nhập đã cũ. Vui lòng đăng xuất và đăng nhập lại';
    default:
      return 'Có lỗi xảy ra khi xóa tài khoản';
  }
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const clearSavedUserInfo = useAuthStore((state) => state.clearSavedUserInfo);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = confirmText === REQUIRED_CONFIRM_TEXT && password.length > 0;

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    try {
      const user = auth.currentUser;
      if (!user?.email) throw new Error('Không tìm thấy người dùng');

      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
      await settingsService.deleteUserAccountData(user.uid);
      await deleteUser(user);
      clearSavedUserInfo();

      showToast('Tài khoản đã được xóa vĩnh viễn', 'success');
    } catch (error) {
      const code = (error as { code?: string }).code;
      console.error('Delete account failed:', code ?? 'unknown');
      showToast(messageForDeleteError(code), 'error', 6000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xóa tài khoản"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger"
            className="flex-1"
            disabled={!canDelete || isDeleting}
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-sm border border-danger/30 bg-danger/5 text-ink mb-2">
          <AlertTriangle size={24} className="flex-shrink-0 text-danger" />
          <p className="text-body-sm font-medium">
            Hành động này <span className="font-semibold underline">không thể hoàn tác</span>!
          </p>
        </div>

        <p className={`text-body-sm text-ink-muted leading-relaxed`}>
          Toàn bộ dữ liệu về nhân viên, ca làm, sự kiện và lịch sử thanh toán của bạn sẽ bị xóa vĩnh
          viễn khỏi hệ thống.
        </p>

        <div className="pt-2">
          <label
            htmlFor="delete-account-confirm"
            className={`block text-label font-medium text-ink-muted mb-2`}
          >
            Nhập <span className="font-semibold text-danger">"{REQUIRED_CONFIRM_TEXT}"</span> để xác
            nhận:
          </label>
          <input
            id="delete-account-confirm"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={REQUIRED_CONFIRM_TEXT}
            className={`w-full px-3 py-2.5 min-h-10 rounded-sm border border-line bg-surface-2 text-ink placeholder:text-ink-muted focus:outline-none hover:border-ink-muted transition-colors duration-fast ease-standard text-body-sm ${focusRingOnSurfaceClasses}`}
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="delete-account-password"
            className={`block text-label font-medium text-ink-muted mb-2`}
          >
            Mật khẩu hiện tại
          </label>
          <input
            id="delete-account-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Nhập mật khẩu để xác thực lại"
            className={`w-full px-3 py-2.5 min-h-10 rounded-sm border border-line bg-surface-2 text-ink placeholder:text-ink-muted focus:outline-none hover:border-ink-muted transition-colors duration-fast ease-standard text-body-sm ${focusRingOnSurfaceClasses}`}
          />
          <p className={`mt-2 text-body-sm text-ink-muted`}>
            Cần xác thực lại mật khẩu trước khi xóa vĩnh viễn.
          </p>
        </div>
      </div>
    </Modal>
  );
};
