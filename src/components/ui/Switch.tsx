import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { focusRingOnSurfaceClasses } from '@/lib/utils';

const Switch = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className={`group relative flex h-10 w-12 items-center rounded-sm ${focusRingOnSurfaceClasses}`}
      aria-label="Chế độ tối"
    >
      <span className="relative block h-6 w-11 rounded-sm border border-ink-muted bg-surface-2 transition-colors duration-fast ease-standard hover:border-ink">
        <span
          className={`absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-xs bg-ink transition-transform duration-fast ease-standard ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {isDark ? (
            <Moon size={12} className="text-canvas" />
          ) : (
            <Sun size={12} className="text-canvas" />
          )}
        </span>
      </span>
    </button>
  );
};

export default Switch;
