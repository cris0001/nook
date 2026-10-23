import type { JSONContent } from '@tiptap/react';

import { db } from '@/lib/db';

export async function getContent(pageId: string): Promise<JSONContent | null> {
  const row = await db.contents.get(pageId);
  return (row?.doc as JSONContent | undefined) ?? null;
}

export async function saveContent(pageId: string, doc: JSONContent): Promise<void> {
  await db.contents.put({ id: pageId, doc, updatedAt: Date.now() });
}
