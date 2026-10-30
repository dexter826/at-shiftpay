import React from 'react';
import { useThemeStore } from '@/stores/themeStore';
import Switch from '@/components/ui/Switch';

const ThemeSwitch: React.FC = () => {
  const { resolvedTheme, setTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
    />
  );
};

export default ThemeSwitch;
