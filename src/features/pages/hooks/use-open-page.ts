import { useEffect } from 'react';

import { db } from '@/lib/db';

import { markPageOpened } from '../api/pages';
import { useSidebarUiStore } from '../stores/sidebar-ui.store';

// Side effects of opening a page: log the visit for "Recently opened", and expand its
// ancestors in the sidebar so the open page is visible in the tree (e.g. after
// following a link or a favorite to a deeply nested page).
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
