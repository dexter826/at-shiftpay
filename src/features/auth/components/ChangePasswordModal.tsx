import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertCircle, Check, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = `flex-1 min-w-0 bg-transparent text-ink placeholder:text-ink-muted focus:outline-none text-body-sm`;
  const fieldGroupStyle = `flex items-center gap-2 px-3 min-h-10 rounded-sm border border-line bg-surface-2 transition-colors duration-fast ease-standard focus-within:border-ink-muted focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface`;

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    if (!currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return false;
    }
    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      // Xác thực lại tài khoản
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Ghi mật khẩu mới
      await updatePassword(user, newPassword);

      setSuccess('Đổi mật khẩu thành công!');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      const code = (err as { code?: string }).code;
      console.error('Change password error:', err);
      if (code === 'auth/wrong-password') {
        setError('Mật khẩu hiện tại không đúng');
      } else if (code === 'auth/weak-password') {
        setError('Mật khẩu quá yếu');
      } else if (code === 'auth/requires-recent-login') {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError('Không thể đổi mật khẩu. Vui lòng thử lại sau.');
      }
    } finally {
      if (!success) {
        // Giữ loading nếu thất bại
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      isOpen={isOpen}
      onClose={handleClose}
      footer={
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1" disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
            {!loading && <Check size={16} />}
            {loading ? 'Đang xử lý...' : 'Cập nhật'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Username ẩn hỗ trợ password manager */}
        <input
          type="text"
          name="username"
          value={auth.currentUser?.email || ''}
          readOnly
          className="hidden"
          autoComplete="username"
        />
        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger/5 border border-danger/30 text-ink text-body-sm rounded-sm">
            <AlertCircle size={16} className="shrink-0 text-danger" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 text-success text-body-sm rounded-sm">
            <CheckCircle size={16} className="shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Mật khẩu hiện tại */}
        <div>
          <label
            htmlFor="change-current-password"
            className={`block text-label font-medium text-ink-muted mb-1.5`}
          >
            Mật khẩu hiện tại
          </label>
          <div className={fieldGroupStyle}>
            <Lock size={18} className="text-ink-muted shrink-0" />
            <input
              id="change-current-password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputStyle}
              placeholder="Nhập mật khẩu hiện tại"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              aria-label={showCurrentPassword ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
              className={`flex h-10 w-10 items-center justify-center rounded-xs text-ink-muted hover:text-ink transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label
            htmlFor="change-new-password"
            className={`block text-label font-medium text-ink-muted mb-1.5`}
          >
            Mật khẩu mới
          </label>
          <div className={fieldGroupStyle}>
            <Lock size={18} className="text-ink-muted shrink-0" />
            <input
              id="change-new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputStyle}
              placeholder="Nhập mật khẩu mới (min 6 ký tự)"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
              className={`flex h-10 w-10 items-center justify-center rounded-xs text-ink-muted hover:text-ink transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div>
          <label
            htmlFor="change-confirm-password"
            className={`block text-label font-medium text-ink-muted mb-1.5`}
          >
            Xác nhận mật khẩu mới
          </label>
          <div className={fieldGroupStyle}>
            <Lock size={18} className="text-ink-muted shrink-0" />
            <input
              id="change-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputStyle}
              placeholder="Nhập lại mật khẩu mới"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
              className={`flex h-10 w-10 items-center justify-center rounded-xs text-ink-muted hover:text-ink transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
