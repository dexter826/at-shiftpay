import { useThemeStore } from '@/stores/themeStore';

export const useThemeStyles = () => {
  const { theme, toggleTheme } = useThemeStore();

  return {
    theme,
    toggleTheme,
    bgClass: 'bg-canvas',
    cardBgClass: 'bg-surface',
    borderClass: 'border-line',
    divideClass: 'divide-line',
    textPrimaryClass: 'text-ink',
    textSecondaryClass: 'text-ink-soft',
    textMutedClass: 'text-ink-muted',
    inputBgClass: 'bg-surface-2',
    inputBorderClass: 'border-line',
    hoverBgClass: 'hover:bg-line transition-colors duration-200',
    highlightBgClass: 'bg-line',
    skeletonBgClass: 'bg-line',
    shimmerClass:
      theme === 'dark'
        ? 'from-transparent via-white/[0.04] to-transparent'
        : 'from-transparent via-black/[0.04] to-transparent',
  };
};
