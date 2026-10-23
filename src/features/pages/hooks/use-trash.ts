import { useLiveQuery } from 'dexie-react-hooks';

import type { Page } from '@/schemas/page.schema';

import { listTrash } from '../api/pages';

export type TrashState = { status: 'loading' } | { status: 'ready'; pages: Page[] };

// Trashed pages (one row per trashed batch), live.
export function useTrash(): TrashState {
  const pages = useLiveQuery(listTrash, []);
  return pages ? { status: 'ready', pages } : { status: 'loading' };
}
