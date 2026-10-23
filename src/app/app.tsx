import { RouterProvider } from '@tanstack/react-router';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Toaster } from '@/components/toaster';

import { router } from './router';

// Root application component: the router, plus the app-wide toast host and the single
// dialog behind useConfirm().
export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <ConfirmDialog />
    </>
  );
}
