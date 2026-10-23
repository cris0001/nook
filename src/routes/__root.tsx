import { createRootRoute, Outlet } from '@tanstack/react-router';

import { SplashScreen } from '@/features/splash';

// Root layout for every route. Renders the matched child, with the once-per-session
// splash on top while the app loads underneath.
export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <SplashScreen />
    </>
  );
}
