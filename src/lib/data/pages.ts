import type { JSONContent } from '@tiptap/react';
import { generateKeyBetween } from 'fractional-indexing';

import { db } from '@/lib/db';
import type { Page, PageType } from '@/schemas/page.schema';

import { byOrder } from '@/utils/order';

import { writeLinks } from './links';

export interface CreatePageInput {
  parentId: string | null;
  type: PageType;
  title?: string;
  properties?: Page['properties'];
}

export async function listPages(): Promise<Page[]> {
  const pages = await db.pages.toArray();
  return pages.filter((page) => page.deletedAt === null);
}

export function getPage(id: string): Promise<Page | undefined> {
  return db.pages.get(id);
}

async function childrenOf(parentId: string | null): Promise<Page[]> {
  const pages = await listPages();
  return pages.filter((page) => page.parentId === parentId).sort(byOrder);
}

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

export async function setPageIcon(id: string, icon: string | null): Promise<void> {
  await db.pages.update(id, { icon, updatedAt: Date.now() });
}

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

export async function movePage(id: string, parentId: string | null, order: string): Promise<void> {
  await db.pages.update(id, { parentId, order, updatedAt: Date.now() });
}

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

// Databases keep their columns and views in side tables keyed by the page id; a copied
// database page needs its own copies of those. Property ids are kept, so the copied
// records' values (keyed by property id) still line up.
async function copyDatabaseRows(newIds: Map<string, string>): Promise<void> {
  for (const [oldId, newId] of newIds) {
    const database = await db.databases.get(oldId);
    if (!database) {
      continue;
    }
    await db.databases.add({ ...database, id: newId });
    const views = await db.views.where('databaseId').equals(oldId).toArray();
    await db.views.bulkAdd(
      views.map((view) => ({ ...view, id: crypto.randomUUID(), databaseId: newId })),
    );
  }
}

async function copyContents(newIds: Map<string, string>): Promise<void> {
  const rows = await db.contents.bulkGet([...newIds.keys()]);
  await db.contents.bulkAdd(
    rows.flatMap((row) => {
      const id = row && newIds.get(row.id);
      return row && id ? [{ ...row, id, updatedAt: Date.now() }] : [];
    }),
  );
  for (const row of rows) {
    const id = row && newIds.get(row.id);
    if (row && id) await writeLinks(id, row.doc as JSONContent);
  }
}

export async function duplicatePage(id: string): Promise<Page | undefined> {
  return db.transaction(
    'rw',
    [db.pages, db.databases, db.views, db.contents, db.links],
    async () => {
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
        order:
          page.id === id ? generateKeyBetween(original.order, next?.order ?? null) : page.order,
        favoritedAt: null,
        lastOpenedAt: null,
        createdAt: now,
        updatedAt: now,
      }));
      await db.pages.bulkAdd(copies);
      await copyDatabaseRows(newIds);
      await copyContents(newIds);
      return copies[0];
    },
  );
}

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

export async function deletePageForever(id: string): Promise<void> {
  await db.transaction(
    'rw',
    [db.pages, db.databases, db.views, db.contents, db.links],
    async () => {
      const page = await db.pages.get(id);
      if (!page?.deletedAt) {
        return;
      }
      const batch = page.deletedAt;
      const ids = await subtreeIds(id);
      const rows = (await db.pages.bulkGet(ids)).filter((p): p is Page => p?.deletedAt === batch);
      const gone = rows.map((p) => p.id);
      await db.pages.bulkDelete(gone);
      await db.databases.bulkDelete(gone);
      await db.views.where('databaseId').anyOf(gone).delete();
      await db.contents.bulkDelete(gone);
      await db.links.where('sourceId').anyOf(gone).delete();
    },
  );
}
