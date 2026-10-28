import type { Page } from '@/schemas/page.schema';

import { useKeyedLiveQuery } from '@/hooks/use-keyed-live-query';
import { getPage } from '@/lib/data/pages';

export type PageState =
  { status: 'loading' } | { status: 'missing' } | { status: 'ready'; page: Page };

// One page, live. useLiveQuery returns undefined while loading, so a missing row is
// mapped to null to tell "not there" apart from "not loaded yet". Trashed pages count
// as missing — they shouldn't be editable from a stale link.
export function usePage(id: string): PageState {
  const page = useKeyedLiveQuery(id, async () => {
    const row = await getPage(id);
    return row?.deletedAt === null ? row : null;
  });

  if (page === undefined) {
    return { status: 'loading' };
  }
  return page ? { status: 'ready', page } : { status: 'missing' };
}
