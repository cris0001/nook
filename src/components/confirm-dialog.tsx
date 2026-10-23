import { AlertDialog } from 'radix-ui';

import { useCommonTranslation } from '@/lib/i18n/common';
import { cn } from '@/lib/utils';
import { useConfirmStore } from '@/stores/confirm.store';

export function ConfirmDialog() {
  const t = useCommonTranslation();
  const options = useConfirmStore((s) => s.options);
  const answer = useConfirmStore((s) => s.answer);

  return (
    <AlertDialog.Root open={options !== null} onOpenChange={(open) => !open && answer(false)}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <AlertDialog.Content className="bg-background fixed top-1/2 left-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-md border p-5 shadow-xl">
          <AlertDialog.Title className="font-heading text-lg font-semibold">
            {options?.title}
          </AlertDialog.Title>
          {options?.description ? (
            <AlertDialog.Description className="text-muted-foreground mt-1 text-sm">
              {options.description}
            </AlertDialog.Description>
          ) : null}
          <div className="mt-5 flex justify-end gap-2">
            <AlertDialog.Cancel className="hover:bg-hover h-9 rounded-md border px-3 text-sm">
              {t.cancel}
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={() => answer(true)}
              className={cn(
                'h-9 rounded-md px-3 text-sm font-semibold',
                options?.destructive
                  ? 'bg-destructive text-white hover:brightness-95'
                  : 'bg-primary text-primary-foreground hover:brightness-95',
              )}
            >
              {options?.confirmText ?? t.delete}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
