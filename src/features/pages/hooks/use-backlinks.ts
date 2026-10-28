import { useLiveQuery } from 'dexie-react-hooks';

import { listBacklinks } from '@/lib/data/links';

export function useBacklinks(pageId: string) {
  return useLiveQuery(() => listBacklinks(pageId), [pageId]) ?? [];
}
