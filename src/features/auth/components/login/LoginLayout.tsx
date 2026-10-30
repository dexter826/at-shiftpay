import React from 'react';
import { CheckCircle2, Heart, Moon, Sun, Wallet, CalendarRange } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { focusRingClasses } from '@/lib/utils';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const ThemeButton: React.FC<{ onBrand?: boolean }> = ({ onBrand = false }) => {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className={
        onBrand
          ? 'flex h-11 w-11 items-center justify-center rounded-sm border border-on-brand/30 text-on-brand transition-colors duration-fast ease-standard hover:bg-on-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-brand focus-visible:ring-offset-2 focus-visible:ring-offset-brand'
          : `flex h-11 w-11 items-center justify-center rounded-sm border border-line text-ink-muted transition-colors duration-fast ease-standard hover:border-line-strong hover:text-ink ${focusRingClasses}`
      }
    >
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
};

const benefits = [
  { icon: CalendarRange, text: 'Xếp ca trên một bảng tuần' },
  { icon: CheckCircle2, text: 'Chốt công theo từng ca' },
  { icon: Wallet, text: 'Thanh toán và đối soát một chỗ' },
];

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => (
  <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[46%_54%]">
    <aside className="hidden flex-col justify-between bg-brand p-10 text-on-brand lg:flex">
      <img
        src="/brand/lockup-white.svg"
        alt="ShiftPay"
        className="h-12 w-auto max-w-[250px] object-contain"
      />
      <div className="max-w-sm">
        <p className="text-[2.2rem] font-semibold leading-[1.1] tracking-tight">
          Ca làm rõ ràng.
          <br />
          Lương minh bạch.
        </p>
        <p className="mt-4 text-body-sm leading-relaxed text-on-brand/85">
          Một chỗ cho lịch ca, chấm công và thanh toán.
        </p>
        <ul className="mt-8 space-y-3.5 text-body-sm">
          {benefits.map((benefit) => (
            <li key={benefit.text} className="flex items-center gap-3">
              <benefit.icon size={16} aria-hidden="true" className="text-on-brand/80" />
              <span className="text-on-brand/90">{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="max-w-[250px] text-label leading-relaxed text-on-brand/85">
        ShiftPay · Quản lý ca làm
      </p>
    </aside>

    <main className="flex min-h-dvh flex-col">
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-brand px-5 py-5 text-on-brand">
          <img
            src="/brand/lockup-white.svg"
            alt="ShiftPay"
            className="h-9 w-auto max-w-[190px] object-contain"
          />
          <ThemeButton onBrand />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="hidden justify-end px-6 pt-5 lg:flex">
          <ThemeButton />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="flex items-center justify-center gap-1.5 pb-6 text-label text-ink-muted">
          Made with <Heart size={11} aria-hidden="true" /> by
          <a
            href="https://github.com/dexter826/dexter826"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-11 items-center rounded-sm font-semibold text-ink-muted hover:text-ink ${focusRingClasses}`}
          >
            MOB
          </a>
        </p>
      </div>
    </main>
  </div>
);

export default LoginLayout;
