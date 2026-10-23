import { useLiveQuery } from 'dexie-react-hooks';

import type { Page } from '@/schemas/page.schema';

import { listPages } from '@/lib/data/pages';

export type PagesState = { status: 'loading' } | { status: 'ready'; pages: Page[] };

// All live (non-trashed) pages. useLiveQuery re-runs whenever the pages table changes —
// in this tab or another — so the sidebar never needs manual refreshing.
export function usePages(): PagesState {
  const pages = useLiveQuery(listPages, []);
  return pages ? { status: 'ready', pages } : { status: 'loading' };
}
