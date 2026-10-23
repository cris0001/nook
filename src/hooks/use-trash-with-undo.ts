import { useCallback } from 'react';
import { toast } from 'sonner';

import { restorePage, trashPage } from '@/lib/data/pages';
import { useCommonTranslation } from '@/lib/i18n/common';

// Moves a page (or record) to the trash and offers a one-tap Undo — trashing is easy
// to do by accident from a "⋯" menu, and the trash view is a detour.
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
