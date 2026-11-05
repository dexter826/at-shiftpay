import React from 'react';
import { Heart, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { focusRingClasses } from '@/lib/utils';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const ThemeButton: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className={`flex h-10 w-10 items-center justify-center rounded-sm border border-line text-ink-muted transition-colors duration-fast ease-standard hover:border-line-strong hover:text-ink ${focusRingClasses}`}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
};

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col justify-between overflow-hidden bg-canvas px-4 py-3 sm:px-6 sm:py-4">
      <div className="absolute right-3 top-3 z-10 sm:right-5 sm:top-5">
        <ThemeButton />
      </div>

      <div />

      <main className="my-auto flex w-full items-center justify-center">
        <div className="w-full max-w-[400px]">
          <div className="mb-4 flex justify-center">
            <img
              src={isDark ? '/brand/lockup-white.svg' : '/brand/lockup.svg'}
              alt="ShiftPay"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </div>

          <div className="rounded-sm border border-line bg-surface p-5 sm:p-6">
            {children}
          </div>
        </div>
      </main>

      <footer className="shrink-0 py-2 text-center text-label text-ink-muted">
        <p className="flex items-center justify-center gap-1.5">
          Made with <Heart size={11} aria-hidden="true" /> by{' '}
          <a
            href="https://github.com/dexter826/dexter826"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-8 items-center rounded-sm font-semibold text-ink-muted hover:text-ink ${focusRingClasses}`}
          >
            MOB
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LoginLayout;
