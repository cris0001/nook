import { useLiveQuery } from 'dexie-react-hooks';

import type { Page } from '@/schemas/page.schema';

import { listTrash } from '@/lib/data/pages';

export type TrashState = { status: 'loading' } | { status: 'ready'; pages: Page[] };

export function useTrash(): TrashState {
  const pages = useLiveQuery(listTrash, []);
  return pages ? { status: 'ready', pages } : { status: 'loading' };
}
