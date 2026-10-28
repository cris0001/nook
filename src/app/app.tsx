import { RouterProvider } from '@tanstack/react-router';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ShortcutsDialog } from '@/components/shortcuts-dialog';
import { Toaster } from '@/components/toaster';

import { router } from './router';

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <ConfirmDialog />
      <ShortcutsDialog />
    </>
  );
}
