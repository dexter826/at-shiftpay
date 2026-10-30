import React, { useState } from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { settingsService } from '@/lib/api/settingsService';
import { auth } from '@/lib/firebase';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/authStore';

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
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : (
              <Trash2 size={18} className="mr-2" />
            )}
            {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-500 mb-2">
          <AlertTriangle size={24} className="flex-shrink-0" />
          <p className="text-sm font-medium">
            Hành động này <span className="font-bold uppercase underline">không thể hoàn tác</span>!
          </p>
        </div>

        <p className={`text-sm text-[var(--text-muted)] leading-relaxed`}>
          Toàn bộ dữ liệu về nhân viên, ca làm, sự kiện và lịch sử thanh toán của bạn sẽ bị xóa vĩnh
          viễn khỏi hệ thống.
        </p>

        <div className="pt-2">
          <label
            htmlFor="delete-account-confirm"
            className={`block text-sm font-medium text-[var(--text-primary)] mb-2`}
          >
            Nhập <span className="font-bold text-red-500">"{REQUIRED_CONFIRM_TEXT}"</span> để xác
            nhận:
          </label>
          <input
            id="delete-account-confirm"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={REQUIRED_CONFIRM_TEXT}
            className={`w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] focus:outline-none focus:border-red-500 transition-colors text-sm`}
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="delete-account-password"
            className={`block text-sm font-medium text-[var(--text-primary)] mb-2`}
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
            className={`w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] focus:outline-none focus:border-red-500 transition-colors text-sm`}
          />
          <p className={`mt-2 text-xs text-[var(--text-muted)]`}>
            Cần xác thực lại mật khẩu trước khi xóa vĩnh viễn.
          </p>
        </div>
      </div>
    </Modal>
  );
};
