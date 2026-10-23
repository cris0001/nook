import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

import { useCommonTranslation } from '@/lib/i18n/common';
import { applyTheme, useThemeStore, type Theme } from '@/stores/theme.store';

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const ICON = { system: Monitor, light: Sun, dark: Moon } as const;

export function ThemeToggle() {
  const t = useCommonTranslation();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const Icon = ICON[theme];
  return (
    <button
      type="button"
      aria-label={t.theme[theme]}
      title={t.theme[theme]}
      onClick={() => setTheme(NEXT[theme])}
      className="text-muted-foreground hover:bg-hover hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors"
    >
      <Icon className="size-4" />
    </button>
  );
}
