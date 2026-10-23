import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallback } from 'react';

import { getPage, trashPage } from '@/lib/data/pages';

// Moves a page (and its subpages) to the trash. If the open page went with it, the
// view falls back to the workspace home instead of a "not found" screen.
export function useTrashPage() {
  const navigate = useNavigate();
  const openPageId = useParams({ strict: false, select: (params) => params.pageId });

  return useCallback(
    async (id: string) => {
      await trashPage(id);
      const open = openPageId ? await getPage(openPageId) : undefined;
      if (open && open.deletedAt !== null) {
        await navigate({ to: '/' });
      }
    },
    [navigate, openPageId],
  );
}
