import type { JSONContent } from '@tiptap/react';

import { db } from '@/lib/db';
import type { Page } from '@/schemas/page.schema';
import { mentionTargets } from '@/utils/mentions';

const linkId = (sourceId: string, targetId: string) => `${sourceId}>${targetId}`;

// Call inside a transaction that includes `db.links`.
export async function writeLinks(sourceId: string, doc: JSONContent | null): Promise<void> {
  await db.links.where('sourceId').equals(sourceId).delete();
  const targets = mentionTargets(doc).filter((targetId) => targetId !== sourceId);
  await db.links.bulkAdd(
    targets.map((targetId) => ({ id: linkId(sourceId, targetId), sourceId, targetId })),
  );
}

export async function rebuildLinks(): Promise<void> {
  await db.links.clear();
  const contents = await db.contents.toArray();
  for (const row of contents) {
    await writeLinks(row.id, row.doc as JSONContent);
  }
}

export async function listBacklinks(targetId: string): Promise<Page[]> {
  const links = await db.links.where('targetId').equals(targetId).toArray();
  const pages = await db.pages.bulkGet(links.map((link) => link.sourceId));
  return pages
    .filter((page): page is Page => page?.deletedAt === null)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}
