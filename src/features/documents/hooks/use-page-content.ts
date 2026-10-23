import type { JSONContent } from '@tiptap/react';
import { useLiveQuery } from 'dexie-react-hooks';

import { getContent } from '@/lib/data/contents';

export type PageContentState = { status: 'loading' } | { status: 'ready'; doc: JSONContent | null };

// The stored body of a page. Only its first value matters to the editor (which then
// owns the document); later updates are its own saves echoing back.
export function usePageContent(pageId: string): PageContentState {
  const doc = useLiveQuery(async () => ({ doc: await getContent(pageId) }), [pageId]);
  return doc ? { status: 'ready', doc: doc.doc } : { status: 'loading' };
}
