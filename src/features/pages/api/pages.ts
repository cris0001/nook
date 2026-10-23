import { generateKeyBetween } from 'fractional-indexing';

import { db } from '@/lib/db';
import type { Page, PageType } from '@/schemas/page.schema';

import { byOrder } from '../utils/page-tree';

export interface CreatePageInput {
  parentId: string | null;
  type: PageType;
  title?: string;
  properties?: Page['properties'];
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
export async function createPage({
  parentId,
  type,
  title = '',
  properties = {},
}: CreatePageInput): Promise<Page> {
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
      properties,
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

// Sets the page's emoji, or clears it with null (the type icon shows instead).
export async function setPageIcon(id: string, icon: string | null): Promise<void> {
  await db.pages.update(id, { icon, updatedAt: Date.now() });
}

// Stars / unstars a page. The timestamp doubles as the favorites order.
export async function toggleFavorite(id: string): Promise<void> {
  const page = await db.pages.get(id);
  if (page) {
    await db.pages.update(id, { favoritedAt: page.favoritedAt === null ? Date.now() : null });
  }
}

// Records a visit for "Recently opened". Deliberately leaves updatedAt alone — opening
// a page isn't editing it.
export async function markPageOpened(id: string): Promise<void> {
  await db.pages.update(id, { lastOpenedAt: Date.now() });
}

// Re-parents and/or reorders a page. The target spot is worked out by planDrop.
export async function movePage(id: string, parentId: string | null, order: string): Promise<void> {
  await db.pages.update(id, { parentId, order, updatedAt: Date.now() });
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

// Copies a page and everything under it, fresh ids throughout, and places the copy
// right after the original. Returns the new top page.
export async function duplicatePage(id: string): Promise<Page | undefined> {
  return db.transaction('rw', db.pages, async () => {
    const original = await db.pages.get(id);
    if (original?.deletedAt !== null) {
      return undefined;
    }

    const siblings = await childrenOf(original.parentId);
    const next = siblings[siblings.findIndex((page) => page.id === id) + 1];
    const now = Date.now();
    const ids = await subtreeIds(id);
    const rows = (await db.pages.bulkGet(ids)).filter((p): p is Page => p?.deletedAt === null);
    const newIds = new Map(rows.map((page) => [page.id, crypto.randomUUID()]));

    const copies = rows.map((page) => ({
      ...page,
      id: newIds.get(page.id) ?? crypto.randomUUID(),
      parentId: page.id === id ? page.parentId : (newIds.get(page.parentId ?? '') ?? null),
      order: page.id === id ? generateKeyBetween(original.order, next?.order ?? null) : page.order,
      favoritedAt: null,
      lastOpenedAt: null,
      createdAt: now,
      updatedAt: now,
    }));
    await db.pages.bulkAdd(copies);
    return copies[0];
  });
}

// What the trash shows: each trashed batch once, by its top page. Pages trashed along
// with a parent come back (or go) with it, so they aren't listed on their own.
export async function listTrash(): Promise<Page[]> {
  const pages = await db.pages.toArray();
  const byId = new Map(pages.map((page) => [page.id, page]));
  return pages
    .filter((page) => {
      if (page.deletedAt === null) {
        return false;
      }
      const parent = page.parentId ? byId.get(page.parentId) : undefined;
      return parent?.deletedAt !== page.deletedAt;
    })
    .sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0));
}

// Permanently removes a trashed page and the descendants trashed with it.
export async function deletePageForever(id: string): Promise<void> {
  await db.transaction('rw', db.pages, async () => {
    const page = await db.pages.get(id);
    if (!page?.deletedAt) {
      return;
    }
    const batch = page.deletedAt;
    const ids = await subtreeIds(id);
    const rows = (await db.pages.bulkGet(ids)).filter((p): p is Page => p?.deletedAt === batch);
    await db.pages.bulkDelete(rows.map((p) => p.id));
  });
}
