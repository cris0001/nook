import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallback } from 'react';

import { useTrashWithUndo } from '@/hooks/use-trash-with-undo';
import { getPage } from '@/lib/data/pages';

// Moves a page (and its subpages) to the trash. If the open page went with it, the
// view falls back to the workspace home instead of a "not found" screen. A toast offers
// Undo.
export function useTrashPage() {
  const navigate = useNavigate();
  const trashWithUndo = useTrashWithUndo();
  const openPageId = useParams({ strict: false, select: (params) => params.pageId });

  return useCallback(
    async (id: string) => {
      await trashWithUndo(id, (await getPage(id))?.title ?? '');
      const open = openPageId ? await getPage(openPageId) : undefined;
      if (open && open.deletedAt !== null) {
        await navigate({ to: '/' });
      }
    },
    [navigate, openPageId, trashWithUndo],
  );
}
