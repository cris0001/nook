import { generateKeyBetween } from 'fractional-indexing';

import { db } from '@/lib/db';
import type { Page, PageType } from '@/schemas/page.schema';

import { byOrder } from '../utils/page-tree';

export interface CreatePageInput {
  parentId: string | null;
  type: PageType;
  title?: string;
}

// Every page that isn't in the trash. The sidebar shapes these into a tree.
export async function listPages(): Promise<Page[]> {
  const pages = await db.pages.toArray();
  return pages.filter((page) => page.deletedAt === null);
}

export function getPage(id: string): Promise<Page | undefined> {
  return db.pages.get(id);
}

// Live children of a parent (null = root), in tree order.
async function childrenOf(parentId: string | null): Promise<Page[]> {
  const pages = await listPages();
  return pages.filter((page) => page.parentId === parentId).sort(byOrder);
}

// Appends a new page as the last child of `parentId`.
export async function createPage({ parentId, type, title = '' }: CreatePageInput): Promise<Page> {
  return db.transaction('rw', db.pages, async () => {
    const siblings = await childrenOf(parentId);
    const now = Date.now();
    const page: Page = {
      id: crypto.randomUUID(),
      parentId,
      type,
      title,
      icon: null,
      order: generateKeyBetween(siblings.at(-1)?.order ?? null, null),
      favoritedAt: null,
      lastOpenedAt: null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    await db.pages.add(page);
    return page;
  });
}

export async function renamePage(id: string, title: string): Promise<void> {
  await db.pages.update(id, { title, updatedAt: Date.now() });
}

// Ids of a page and everything nested under it.
async function subtreeIds(id: string): Promise<string[]> {
  const pages = await db.pages.toArray();
  const ids = [id];
  // Breadth-first: the loop also visits ids pushed while it runs.
  for (const parent of ids) {
    ids.push(...pages.filter((page) => page.parentId === parent).map((page) => page.id));
  }
  return ids;
}

// Moves a page and all its descendants to the trash. They share one `deletedAt`, so a
// restore brings back exactly that batch — not children trashed separately earlier.
export async function trashPage(id: string): Promise<void> {
  await db.transaction('rw', db.pages, async () => {
    const now = Date.now();
    const ids = await subtreeIds(id);
    const live = (await db.pages.bulkGet(ids)).filter(
      (page): page is Page => page?.deletedAt === null,
    );
    await db.pages.bulkUpdate(
      live.map((page) => ({ key: page.id, changes: { deletedAt: now, updatedAt: now } })),
    );
  });
}

// Brings a trashed page back with the descendants trashed together with it. If its old
// parent is still in the trash (or gone), it comes back at the root instead.
export async function restorePage(id: string): Promise<void> {
  await db.transaction('rw', db.pages, async () => {
    const page = await db.pages.get(id);
    if (!page?.deletedAt) {
      return;
    }

    const batch = page.deletedAt;
    const now = Date.now();
    const ids = await subtreeIds(id);
    const trashed = (await db.pages.bulkGet(ids)).filter((p): p is Page => p?.deletedAt === batch);
    await db.pages.bulkUpdate(
      trashed.map((p) => ({ key: p.id, changes: { deletedAt: null, updatedAt: now } })),
    );

    // A missing parent reads as `undefined !== null`, i.e. "not back", too.
    const parent = page.parentId ? await db.pages.get(page.parentId) : undefined;
    if (page.parentId && parent?.deletedAt !== null) {
      const roots = await childrenOf(null);
      await db.pages.update(id, {
        parentId: null,
        order: generateKeyBetween(roots.at(-1)?.order ?? null, null),
      });
    }
  });
}
