import { useEffect } from 'react';

import { db } from '@/lib/db';

import { markPageOpened } from '@/lib/data/pages';
import { useSidebarUiStore } from '../stores/sidebar-ui.store';

export function useOpenPage(pageId: string) {
  useEffect(() => {
    void markPageOpened(pageId);

    void (async () => {
      const { expand } = useSidebarUiStore.getState();
      const seen = new Set<string>();
      let parentId = (await db.pages.get(pageId))?.parentId ?? null;
      while (parentId && !seen.has(parentId)) {
        seen.add(parentId);
        expand(parentId);
        parentId = (await db.pages.get(parentId))?.parentId ?? null;
      }
    })();
  }, [pageId]);
}
