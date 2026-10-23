import { useLiveQuery } from 'dexie-react-hooks';

import type { Page } from '@/schemas/page.schema';

import { listPages } from '@/lib/data/pages';

export type PagesState = { status: 'loading' } | { status: 'ready'; pages: Page[] };

export function usePages(): PagesState {
  const pages = useLiveQuery(listPages, []);
  return pages ? { status: 'ready', pages } : { status: 'loading' };
}
