import type { Page } from '@/schemas/page.schema';

import { useSharedLiveQuery } from '@/hooks/use-shared-live-query';
import { listNavigationPages } from '@/lib/data/pages';

export type PagesState = { status: 'loading' } | { status: 'ready'; pages: Page[] };

// Navigation pages (everything but database records), live and shared between the
// tree, breadcrumbs and favorites.
export function usePages(): PagesState {
  const pages = useSharedLiveQuery('pages:navigation', listNavigationPages);
  return pages ? { status: 'ready', pages } : { status: 'loading' };
}
