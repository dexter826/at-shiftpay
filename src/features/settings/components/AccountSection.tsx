import React, { useRef, useState } from 'react';
import { Camera, Check, ChevronRight, Pencil, Key, Loader2, Trash2, User, X } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { imageService } from '@/lib/api/imageService';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/ui/ToastProvider';
import { ImageCropperModal } from '@/components/ImageCropperModal';
import { DeleteAccountModal } from '@/features/settings/components/DeleteAccountModal';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import type { User as FirebaseUser } from 'firebase/auth';

interface AccountSectionProps {
  user: FirebaseUser | null;
  onChangePassword: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ user, onChangePassword }) => {
  const itemHover = 'hover:bg-surface-2';
  const rowFocus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';
  const { showToast } = useToast();
  const saveUserInfo = useAuthStore((state) => state.saveUserInfo);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');
  const [savingName, setSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleSaveDisplayName = async () => {
    if (!editedName.trim()) {
      showToast('Tên không được để trống', 'error');
      return;
    }
    setSavingName(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: editedName.trim() });
        showToast('Đã cập nhật tên hiển thị', 'success');
        setIsEditingName(false);
      }
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra', 'error');
    }
    setSavingName(false);
  };

  const handleCancelEditName = () => {
    setEditedName(user?.displayName || '');
    setIsEditingName(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file ảnh', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ảnh không được lớn hơn 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploadingAvatar(true);
    try {
      const url = await imageService.uploadImage(croppedFile);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
        saveUserInfo({
          email: auth.currentUser.email!,
          displayName: auth.currentUser.displayName || 'Người dùng',
          photoURL: url,
        });
        showToast('Đã cập nhật ảnh đại diện', 'success');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      showToast('Không thể tải ảnh lên', 'error');
    } finally {
      setIsUploadingAvatar(false);
      setTempImage(null);
    }
  };

  return (
    <section>
      <div className={`flex items-center gap-2 mb-4 px-1 text-title font-semibold text-ink`}>
        <User size={16} />
        <span>Tài khoản</span>
      </div>

      <div className={`bg-surface rounded-md border border-line overflow-hidden`}>
        <div className={`p-4 flex items-center gap-4 border-b border-line`}>
          <button
            type="button"
            onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
            disabled={isUploadingAvatar}
            aria-label="Đổi ảnh đại diện"
            className={`relative w-16 h-16 rounded-full border border-line bg-surface-2 group flex-shrink-0 transition-colors duration-fast ease-standard hover:border-ink-muted disabled:cursor-not-allowed ${focusRingOnSurfaceClasses}`}
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Ảnh đại diện"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src="/avatar.png" alt="Ảnh đại diện" className="w-full h-full object-cover" />
              )}

              {isUploadingAvatar && (
                <span className="absolute inset-0 bg-surface/90 flex items-center justify-center">
                  <Loader2 size={20} className="text-ink animate-spin" />
                </span>
              )}

              {!isUploadingAvatar && (
                <span className="absolute inset-0 bg-surface/90 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 flex items-center justify-center transition-opacity duration-fast ease-standard">
                  <Camera size={18} className="text-ink-soft" />
                </span>
              )}
            </span>
          </button>
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  aria-label="Tên hiển thị"
                  className={`flex-1 min-w-0 px-3 py-2 min-h-10 rounded-sm border border-line bg-surface-2 text-ink placeholder:text-ink-muted focus:outline-none hover:border-ink-muted text-body-sm ${focusRingOnSurfaceClasses}`}
                  placeholder="Nhập tên hiển thị"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveDisplayName}
                  disabled={savingName}
                  aria-label="Lưu tên hiển thị"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard disabled:opacity-60 ${focusRingOnSurfaceClasses}`}
                >
                  <Check size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEditName}
                  disabled={savingName}
                  aria-label="Hủy sửa tên"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard disabled:opacity-60 ${focusRingOnSurfaceClasses}`}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className={`text-title font-semibold text-ink`}>
                  {user?.displayName || 'Người dùng'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  aria-label="Sửa tên hiển thị"
                  className={`flex h-10 w-10 items-center justify-center rounded-sm hover:bg-surface-2 text-ink-muted hover:text-ink transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
            <p className={`text-body-sm text-ink-muted`}>{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangePassword}
          className={`w-full flex items-center justify-between p-4 ${itemHover} transition-colors duration-fast ease-standard text-left border-b border-dashed border-line ${rowFocus}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-surface-2 text-ink-muted">
              <Key size={20} />
            </div>
            <div>
              <p className={`text-body-sm font-medium text-ink`}>Đổi mật khẩu</p>
              <p className={`text-label font-medium text-ink-muted`}>Cập nhật mật khẩu đăng nhập</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className={`w-full flex items-center justify-between p-4 ${itemHover} transition-colors duration-fast ease-standard text-left ${rowFocus}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-surface-2 text-danger">
              <Trash2 size={20} />
            </div>
            <div>
              <p className={`text-body-sm font-medium text-ink`}>Xóa tài khoản</p>
              <p className={`text-label font-medium text-ink-muted`}>
                Xóa vĩnh viễn toàn bộ dữ liệu của bạn
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </button>
      </div>

      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />

      {tempImage && (
        <ImageCropperModal
          isOpen={cropperOpen}
          onClose={() => {
            setCropperOpen(false);
            setTempImage(null);
          }}
          image={tempImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </section>
  );
};

export default AccountSection;
