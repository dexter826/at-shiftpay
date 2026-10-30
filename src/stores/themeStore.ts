import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
};

const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? getSystemTheme() : preference;

const applyTheme = (resolved: ResolvedTheme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0C1210' : '#F2F4F0');
};

interface ThemeState {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),
      setTheme: (theme) => {
        const resolved = resolveTheme(theme);
        applyTheme(resolved);
        set({ theme, resolvedTheme: resolved });
      },
      toggleTheme: () => {
        const next = get().resolvedTheme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next, resolvedTheme: next });
      },
    }),
    {
      name: 'theme',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        const theme = state?.theme ?? 'system';
        const resolved = resolveTheme(theme);
        applyTheme(resolved);
        if (state) state.resolvedTheme = resolved;
      },
    }
  )
);

if (typeof window !== 'undefined') {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', () => {
    const state = useThemeStore.getState();
    if (state.theme !== 'system') return;
    const resolved = getSystemTheme();
    applyTheme(resolved);
    useThemeStore.setState({ resolvedTheme: resolved });
  });
}
