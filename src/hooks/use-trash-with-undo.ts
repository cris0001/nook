import { useCallback } from 'react';
import { toast } from 'sonner';

import { restorePage, trashPage } from '@/lib/data/pages';
import { useCommonTranslation } from '@/lib/i18n/common';

export function useTrashWithUndo() {
  const t = useCommonTranslation();
  return useCallback(
    async (id: string, title: string) => {
      await trashPage(id);
      toast(t.movedToTrash(title || t.untitled), {
        action: { label: t.undo, onClick: () => void restorePage(id) },
      });
    },
    [t],
  );
}
