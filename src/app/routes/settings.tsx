import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { UserSettings } from '@/types/index';
import Switch from '@/components/ui/Switch';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import AccountSection from '@/features/settings/components/AccountSection';
import WorkConfigSection from '@/features/settings/components/WorkConfigSection';
import { ChangePasswordModal } from '@/features/auth/components/ChangePasswordModal';

interface SettingsViewProps {
  user: User | null;
  settings: UserSettings;
  onLogout: () => void;
}

const rowFocus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';

const SettingsView: React.FC<SettingsViewProps> = ({ user, settings, onLogout }) => {
  const { theme } = useThemeStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="pb-28 md:pb-0 bg-canvas min-h-dynamic">
      <div className="p-4 md:p-6 space-y-4">
        <AccountSection user={user} onChangePassword={() => setShowPasswordModal(true)} />

        {user?.uid && <WorkConfigSection userUid={user.uid} settings={settings} />}

        <div className="bg-surface border border-line rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-2 text-ink-soft">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </div>
              <div>
                <p className="text-body-sm font-medium text-ink">Giao diện</p>
                <p className="text-label font-medium text-ink-muted">
                  {theme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng'}
                </p>
              </div>
            </div>
            <Switch />
          </div>
        </div>

        <div className="bg-surface border border-line rounded-md overflow-hidden">
          <button
            type="button"
            onClick={onLogout}
            className={`w-full flex items-center gap-3 p-3.5 hover:bg-danger/5 transition-colors duration-fast ease-standard text-left ${rowFocus}`}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-2 text-danger">
              <LogOut size={16} />
            </div>
            <div>
              <p className="text-body-sm font-medium text-ink">Đăng xuất</p>
              <p className="text-label font-medium text-ink-muted">Kết thúc phiên làm việc</p>
            </div>
          </button>
        </div>
      </div>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
};

export default SettingsView;
