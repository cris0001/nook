import { RouterProvider } from '@tanstack/react-router';

import { router } from './router';

// Root application component. Providers (toasts, confirm dialog, …) will compose
// around the router here as the app grows.
export function App() {
  return <RouterProvider router={router} />;
}
