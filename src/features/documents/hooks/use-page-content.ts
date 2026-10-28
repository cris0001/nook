import type { JSONContent } from '@tiptap/react';

import { useKeyedLiveQuery } from '@/hooks/use-keyed-live-query';
import { getContent } from '@/lib/data/contents';

export type PageContentState = { status: 'loading' } | { status: 'ready'; doc: JSONContent | null };

// The stored body of a page. Only its first value matters to the editor (which then
// owns the document); later updates are its own saves echoing back.
export function usePageContent(pageId: string): PageContentState {
  const doc = useKeyedLiveQuery(pageId, async () => ({ doc: await getContent(pageId) }));
  return doc ? { status: 'ready', doc: doc.doc } : { status: 'loading' };
}
