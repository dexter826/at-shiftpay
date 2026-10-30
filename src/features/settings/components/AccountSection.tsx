import React, { useRef, useState } from 'react';
import { Camera, Check, ChevronRight, Key, Loader2, Pencil, X } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { imageService } from '@/lib/api/imageService';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/ui/ToastProvider';
import { ImageCropperModal } from '@/components/ImageCropperModal';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { getInitials } from '@/utils/initials';
import type { User as FirebaseUser } from 'firebase/auth';

interface AccountSectionProps {
  user: FirebaseUser | null;
  onChangePassword: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ user, onChangePassword }) => {
  const { showToast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);
  const savedUser = useAuthStore((state) => state.savedUser);
  const saveUserInfo = useAuthStore((state) => state.saveUserInfo);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');
  const [nameError, setNameError] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const syncAuthUser = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const snapshot = Object.assign(
      Object.create(Object.getPrototypeOf(currentUser)),
      currentUser
    ) as FirebaseUser;
    setUser(snapshot);
  };

  const handleSaveDisplayName = async () => {
    const trimmedName = editedName.trim();
    if (!trimmedName) {
      setNameError('Nhập tên hiển thị.');
      return;
    }

    setNameError('');
    setSavingName(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmedName });
        syncAuthUser();
        if (savedUser) {
          saveUserInfo({
            ...savedUser,
            displayName: trimmedName,
            photoURL: auth.currentUser.photoURL ?? undefined,
          });
        }
        showToast('Đã cập nhật tên hiển thị.', 'success');
        setIsEditingName(false);
      }
    } catch (error) {
      console.error(error);
      showToast('Không thể cập nhật tên. Thử lại.', 'error');
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEditName = () => {
    setEditedName(user?.displayName || '');
    setNameError('');
    setIsEditingName(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file ảnh.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ảnh không được lớn hơn 5MB.', 'error');
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
        syncAuthUser();
        setAvatarError(false);
        if (savedUser) {
          saveUserInfo({
            ...savedUser,
            photoURL: url,
          });
        }
        showToast('Đã cập nhật ảnh đại diện.', 'success');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      showToast('Không thể tải ảnh lên. Thử lại.', 'error');
    } finally {
      setIsUploadingAvatar(false);
      setTempImage(null);
    }
  };

  const hasPhoto = Boolean(user?.photoURL) && !avatarError;

  return (
    <>
      <div className="border border-line bg-surface">
        <div className="flex items-center gap-4 border-b border-line p-4">
          <button
            type="button"
            onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
            disabled={isUploadingAvatar}
            aria-label="Đổi ảnh đại diện"
            className={`group relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface-2 text-title font-semibold text-ink-soft transition-colors duration-fast ease-standard hover:border-line-strong disabled:cursor-not-allowed ${focusRingOnSurfaceClasses}`}
          >
            {hasPhoto ? (
              <img
                src={user?.photoURL ?? undefined}
                alt="Ảnh đại diện"
                onError={() => setAvatarError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden="true">{getInitials(user?.displayName || 'ShiftPay')}</span>
            )}
            {isUploadingAvatar && (
              <span className="absolute inset-0 flex items-center justify-center bg-surface/90">
                <Loader2 size={20} aria-hidden="true" className="animate-spin text-ink" />
              </span>
            )}
            {!isUploadingAvatar && (
              <span className="absolute inset-0 flex items-center justify-center bg-surface/90 opacity-0 transition-opacity duration-fast ease-standard group-hover:opacity-100 group-focus-visible:opacity-100">
                <Camera size={18} aria-hidden="true" className="text-ink-soft" />
              </span>
            )}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />

          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      value={editedName}
                      onChange={(event) => {
                        setEditedName(event.target.value);
                        if (nameError) setNameError('');
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          void handleSaveDisplayName();
                        }
                        if (event.key === 'Escape') handleCancelEditName();
                      }}
                      aria-label="Tên hiển thị"
                      invalid={Boolean(nameError)}
                      disabled={savingName}
                      autoFocus
                    />
                  </div>
                  <Button
                    variant="secondary"
                    className="w-11 shrink-0 px-0"
                    onClick={handleSaveDisplayName}
                    loading={savingName}
                    aria-label="Lưu tên hiển thị"
                    icon={<Check size={16} />}
                  />
                  <Button
                    variant="secondary"
                    className="w-11 shrink-0 px-0"
                    onClick={handleCancelEditName}
                    disabled={savingName}
                    aria-label="Hủy sửa tên"
                    icon={<X size={16} />}
                  />
                </div>
                {nameError && (
                  <p role="alert" className="text-label text-danger">
                    {nameError}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="truncate text-title font-semibold text-ink">
                    {user?.displayName || 'Người dùng'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(user?.displayName || '');
                      setIsEditingName(true);
                    }}
                    aria-label="Sửa tên hiển thị"
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink ${focusRingOnSurfaceClasses}`}
                  >
                    <Pencil size={14} aria-hidden="true" />
                  </button>
                </div>
                <p className="truncate text-body-sm text-ink-muted">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onChangePassword}
          className={`flex min-h-11 w-full items-center justify-between p-4 text-left transition-colors duration-fast ease-standard hover:bg-surface-2 ${focusRingOnSurfaceClasses}`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface-2 text-ink-muted">
              <Key size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-body-sm font-medium text-ink">Đổi mật khẩu</span>
              <span className="block text-label text-ink-muted">Cập nhật mật khẩu đăng nhập</span>
            </span>
          </span>
          <ChevronRight size={18} aria-hidden="true" className="text-ink-muted" />
        </button>
      </div>

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
    </>
  );
};

export default AccountSection;
