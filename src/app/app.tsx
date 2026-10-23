import { RouterProvider } from '@tanstack/react-router';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Toaster } from '@/components/toaster';

import { router } from './router';

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <ConfirmDialog />
    </>
  );
}
