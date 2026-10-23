import { useEffect } from 'react';

import { applyTheme, useThemeStore } from '@/stores/theme.store';

export function useSystemTheme() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);
}
