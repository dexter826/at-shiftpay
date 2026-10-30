import React, { useRef, useState } from 'react';
import { Camera, Check, ChevronRight, Pencil, Key, Loader2, Trash2, User, X } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { imageService } from '@/lib/api/imageService';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/ui/ToastProvider';
import { ImageCropperModal } from '@/components/ImageCropperModal';
import { DeleteAccountModal } from '@/features/settings/components/DeleteAccountModal';
import type { User as FirebaseUser } from 'firebase/auth';

interface AccountSectionProps {
  user: FirebaseUser | null;
  onChangePassword: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ user, onChangePassword }) => {
  const itemHover = 'hover:bg-line';
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
      <div
        className={`flex items-center gap-2 mb-4 px-1 text-ink-muted text-sm font-medium uppercase tracking-wider`}
      >
        <User size={16} />
        <span>Tài khoản</span>
      </div>

      <div className={`bg-surface rounded-lg border border-line overflow-hidden`}>
        <div className={`p-4 flex items-center gap-4 border-b border-line`}>
          <div
            onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
            className={`relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent flex-shrink-0 cursor-pointer group`}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
            )}

            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 size={20} className="text-white animate-spin" />
              </div>
            )}

            {!isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
            )}
          </div>
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
                  className={`flex-1 min-w-0 px-3 py-2 rounded-lg border border-line bg-transparent text-ink focus:outline-none focus:border-accent text-sm`}
                  placeholder="Nhập tên hiển thị"
                  autoFocus
                />
                <button
                  onClick={handleSaveDisplayName}
                  disabled={savingName}
                  className="p-2 rounded-lg flex-shrink-0 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancelEditName}
                  disabled={savingName}
                  className="p-2 rounded-lg flex-shrink-0 bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold text-ink`}>{user?.displayName || 'Người dùng'}</h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className={`p-1 rounded hover:bg-line text-ink-muted transition-colors`}
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
            <p className={`text-sm text-ink-muted`}>{user?.email}</p>
          </div>
        </div>

        <button
          onClick={onChangePassword}
          className={`w-full flex items-center justify-between p-4 ${itemHover} transition-colors text-left border-b border-line`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent-ink">
              <Key size={20} />
            </div>
            <div>
              <p className={`font-medium text-ink`}>Đổi mật khẩu</p>
              <p className={`text-xs text-ink-muted`}>Cập nhật mật khẩu đăng nhập</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className={`w-full flex items-center justify-between p-4 ${itemHover} transition-colors text-left group`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-danger/10 text-danger group-hover:text-danger">
              <Trash2 size={20} />
            </div>
            <div>
              <p className={`font-medium text-ink group-hover:text-danger`}>Xóa tài khoản</p>
              <p className={`text-xs text-ink-muted`}>Xóa vĩnh viễn toàn bộ dữ liệu của bạn</p>
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
