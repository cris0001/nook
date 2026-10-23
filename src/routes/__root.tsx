import { createRootRoute, Outlet } from '@tanstack/react-router';

// Root layout for every route. Renders the matched child.
export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return <Outlet />;
}
