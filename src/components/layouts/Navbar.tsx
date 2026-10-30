import React from 'react';
import {
  CalendarRange,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  Users,
  Wallet,
} from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface NavbarUser {
  displayName?: string | null;
  email?: string | null;
}

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onLogout: () => void;
  user?: NavbarUser | null;
}

const navItems = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'calendar', label: 'Lịch sự kiện', icon: CalendarRange },
  { id: 'employees', label: 'Nhân sự', icon: Users },
  { id: 'payroll', label: 'Thanh toán', icon: Wallet },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

const railFocus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-rail';

const getInitials = (user?: NavbarUser | null) => {
  const source = user?.displayName || user?.email?.split('@')[0] || 'ShiftPay';
  const initials = source
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return initials || 'SP';
};

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab, onLogout, user }) => {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const activeTabId = currentTab === 'locations' ? 'calendar' : currentTab;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Người dùng';

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--rail-width)] flex-col border-r border-rail-line bg-rail pt-safe text-rail-ink md:flex">
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-rail-line">
          <img src="/brand/mark-reversed.svg" alt="ShiftPay" className="h-8 w-8 object-contain" />
        </div>

        <nav
          className="flex flex-1 flex-col items-center gap-1 overflow-y-auto px-2 py-3"
          aria-label="Điều hướng chính"
        >
          {navItems.map((item) => {
            const isActive = activeTabId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-sm px-1 text-[9px] font-medium leading-tight transition-colors duration-fast ease-standard',
                  isActive
                    ? 'bg-highlight text-highlight-ink'
                    : 'text-rail-muted hover:bg-rail-hover hover:text-rail-ink',
                  railFocus
                )}
              >
                <item.icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 flex-col items-center gap-1 border-t border-rail-line px-2 py-3">
          <button
            type="button"
            onClick={() => setTab('settings')}
            aria-label={`Mở cài đặt của ${displayName}`}
            title={displayName}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full text-highlight-ink transition-opacity duration-fast hover:opacity-90',
              railFocus
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-highlight text-[10px] font-semibold">
              {getInitials(user)}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-sm text-rail-muted transition-colors duration-fast ease-standard hover:bg-rail-hover hover:text-rail-ink',
              railFocus
            )}
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Đăng xuất"
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-sm text-rail-muted transition-colors duration-fast ease-standard hover:bg-rail-hover hover:text-danger',
              railFocus
            )}
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center border-t border-line bg-surface px-2 pb-safe md:hidden"
        aria-label="Điều hướng chính"
      >
        {navItems.map((item) => {
          const isActive = activeTabId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-sm text-[9px] font-medium transition-colors duration-fast ease-standard',
                isActive ? 'text-accent' : 'text-ink-muted hover:text-ink',
                focusRingOnSurfaceClasses
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-0 h-0.5 w-6 rounded-full bg-accent',
                  isActive ? 'opacity-100' : 'opacity-0'
                )}
              />
              <item.icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
