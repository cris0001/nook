import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

import { SplashScreen } from '@/features/splash';
import { useLocaleStore } from '@/stores/locale.store';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <>
      <Outlet />
      <SplashScreen />
    </>
  );
}
