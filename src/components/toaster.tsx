import { Toaster as Sonner } from 'sonner';

import { useThemeStore } from '@/stores/theme.store';

export function Toaster() {
  const theme = useThemeStore((s) => s.theme);
  return (
    <Sonner
      theme={theme}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: '!bg-foreground !text-background !border-0 !rounded-md !shadow-lg',
          actionButton: '!bg-primary !text-primary-foreground !font-semibold',
        },
      }}
    />
  );
}
