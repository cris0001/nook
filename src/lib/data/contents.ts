import type { JSONContent } from '@tiptap/react';

import { db } from '@/lib/db';

// The stored editor document of a page, or null if nothing has been written yet.
export async function getContent(pageId: string): Promise<JSONContent | null> {
  const row = await db.contents.get(pageId);
  return (row?.doc as JSONContent | undefined) ?? null;
}

export async function saveContent(pageId: string, doc: JSONContent): Promise<void> {
  await db.contents.put({ id: pageId, doc: doc, updatedAt: Date.now() });
}
