import type { JSONContent } from '@tiptap/react';

import { db } from '@/lib/db';

import { writeLinks } from './links';

export async function getContent(pageId: string): Promise<JSONContent | null> {
  const row = await db.contents.get(pageId);
  return (row?.doc as JSONContent | undefined) ?? null;
}

export async function saveContent(pageId: string, doc: JSONContent): Promise<void> {
  await db.transaction('rw', db.contents, db.links, async () => {
    await db.contents.put({ id: pageId, doc, updatedAt: Date.now() });
    await writeLinks(pageId, doc);
  });
}
