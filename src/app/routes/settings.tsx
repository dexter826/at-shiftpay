import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { ChevronRight, LogOut, Monitor, Moon, Sun, Trash2 } from 'lucide-react';
import { UserSettings } from '@/types/index';
import { useThemeStore, type ThemePreference } from '@/stores/themeStore';
import AccountSection from '@/features/settings/components/AccountSection';
import WorkConfigSection from '@/features/settings/components/WorkConfigSection';
import { ChangePasswordModal } from '@/features/auth/components/ChangePasswordModal';
import { DeleteAccountModal } from '@/features/settings/components/DeleteAccountModal';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface SettingsViewProps {
  user: User | null;
  settings: UserSettings;
  onLogout: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="font-mono text-mono-label text-ink-muted">{title}</h2>
    {children}
  </section>
);

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  Icon: typeof Monitor;
}> = [
  { value: 'system', label: 'Theo hệ thống', Icon: Monitor },
  { value: 'light', label: 'Sáng', Icon: Sun },
  { value: 'dark', label: 'Tối', Icon: Moon },
];

const SettingsView: React.FC<SettingsViewProps> = ({ user, settings, onLogout }) => {
  const { theme, resolvedTheme, setTheme } = useThemeStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="min-h-dynamic bg-canvas">
      <div className="mx-auto max-w-3xl px-4 py-5 md:px-6 md:py-6">
        <header className="border-b border-line pb-4">
          <p className="truncate font-mono text-mono-label text-ink-muted">
            {user?.email ?? 'Tài khoản'}
          </p>
          <h1 className="mt-1 text-display text-ink">Cài đặt</h1>
        </header>

        <div className="mt-4 space-y-5">
          <Section title="Tài khoản">
            <AccountSection user={user} onChangePassword={() => setShowPasswordModal(true)} />
          </Section>

          {user?.uid && (
            <Section title="Cấu hình công việc">
              <WorkConfigSection userUid={user.uid} settings={settings} />
            </Section>
          )}

          <Section title="Giao diện">
            <div className="border border-line bg-surface p-3">
              <div
                role="group"
                aria-label="Giao diện"
                className="grid grid-cols-1 gap-2 sm:grid-cols-3"
              >
                {THEME_OPTIONS.map(({ value, label, Icon }) => {
                  const isActive = theme === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setTheme(value)}
                      className={cn(
                        'flex min-h-11 items-center justify-center gap-2 rounded-sm border text-body-sm font-medium transition-colors duration-fast ease-standard',
                        isActive
                          ? 'border-accent bg-accent-soft text-accent-ink'
                          : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
                        focusRingOnSurfaceClasses
                      )}
                    >
                      <Icon size={15} aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-label text-ink-muted">
                {theme === 'system'
                  ? `Theo cài đặt thiết bị · đang dùng giao diện ${resolvedTheme === 'dark' ? 'tối' : 'sáng'}.`
                  : 'Giao diện được chọn sẽ được giữ trên thiết bị này.'}
              </p>
            </div>
          </Section>

          <Section title="Phiên đăng nhập">
            <div className="border border-line bg-surface">
              <button
                type="button"
                onClick={onLogout}
                className={cn(
                  'flex min-h-11 w-full items-center justify-between p-4 text-left transition-colors duration-fast ease-standard hover:bg-surface-2',
                  focusRingOnSurfaceClasses
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface-2 text-ink-muted">
                    <LogOut size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-body-sm font-medium text-ink">Đăng xuất</span>
                    <span className="block text-label text-ink-muted">Kết thúc phiên làm việc</span>
                  </span>
                </span>
                <ChevronRight size={18} aria-hidden="true" className="text-ink-muted" />
              </button>
            </div>
          </Section>

          <Section title="Vùng nguy hiểm">
            <div className="border border-danger/30 bg-surface">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className={cn(
                  'flex min-h-11 w-full items-center justify-between p-4 text-left transition-colors duration-fast ease-standard hover:bg-danger/5',
                  focusRingOnSurfaceClasses
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-danger/10 text-danger">
                    <Trash2 size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-body-sm font-medium text-danger">
                      Xóa tài khoản
                    </span>
                    <span className="block text-label text-ink-muted">
                      Xóa vĩnh viễn dữ liệu của bạn
                    </span>
                  </span>
                </span>
                <ChevronRight size={18} aria-hidden="true" className="text-ink-muted" />
              </button>
            </div>
          </Section>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal isOpen onClose={() => setShowPasswordModal(false)} />
      )}

      {showDeleteModal && <DeleteAccountModal isOpen onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
};

export default SettingsView;
