import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallback } from 'react';

import { useTrashWithUndo } from '@/hooks/use-trash-with-undo';
import { getPage } from '@/lib/data/pages';

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
