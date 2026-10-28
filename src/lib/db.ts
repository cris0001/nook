import type { JSONContent } from '@tiptap/react';
import { Dexie, type EntityTable } from 'dexie';
import { generateKeyBetween } from 'fractional-indexing';

import type { Content } from '@/schemas/content.schema';
import type { Database, View } from '@/schemas/database.schema';
import type { Link } from '@/schemas/link.schema';
import type { Page } from '@/schemas/page.schema';
import { mentionTargets } from '@/utils/mentions';

// The whole workspace lives in one IndexedDB database. Only indexed fields go in the
// store definitions; the rest of each row is stored as-is. IndexedDB can't index null,
// so nullable fields (parentId at the root, deletedAt, …) aren't indexed — the page
// tree is small enough to load once and shape in memory. Bump the version with a new
// .stores() call whenever indexes change; Dexie migrates existing data.
export const db = new Dexie('nook') as Dexie & {
  pages: EntityTable<Page, 'id'>;
  databases: EntityTable<Database, 'id'>;
  views: EntityTable<View, 'id'>;
  contents: EntityTable<Content, 'id'>;
  links: EntityTable<Link, 'id'>;
};

db.version(1).stores({
  pages: 'id, parentId, updatedAt',
});

// v2: databases. Adds the column-definition and view tables, and gives every existing
// page an empty `properties` map.
db.version(2)
  .stores({
    pages: 'id, parentId, updatedAt',
    databases: 'id',
    views: 'id, databaseId',
  })
  .upgrade((tx) =>
    tx
      .table<Page>('pages')
      .toCollection()
      .modify((page) => {
        page.properties ??= {};
      }),
  );

// v3: documents. Page bodies live apart from the page rows, so the sidebar and the
// database views never load rich text they don't show.
db.version(3).stores({
  contents: 'id',
});

// v4: backlinks. An index of mentions, rebuilt here from the bodies already stored.
db.version(4)
  .stores({
    links: 'id, sourceId, targetId',
  })
  .upgrade(async (tx) => {
    const contents = await tx.table<Content>('contents').toArray();
    const links = tx.table<Link>('links');
    for (const row of contents) {
      const sourceId = row.id;
      for (const targetId of mentionTargets(row.doc as JSONContent)) {
        if (targetId !== sourceId) {
          await links.put({ id: `${sourceId}>${targetId}`, sourceId, targetId });
        }
      }
    }
  });

// v5: calendar. Every database gets the calendar view next to table and board, dated by
// its first date column.
db.version(5)
  .stores({})
  .upgrade(async (tx) => {
    const views = tx.table<View>('views');
    const existing = await views.toArray();
    for (const database of await tx.table<Database>('databases').toArray()) {
      const own = existing.filter((view) => view.databaseId === database.id);
      if (own.some((view) => view.type === 'calendar')) continue;
      const last =
        own
          .map((view) => view.order)
          .sort()
          .at(-1) ?? null;
      await views.add({
        id: crypto.randomUUID(),
        databaseId: database.id,
        name: '',
        type: 'calendar',
        order: generateKeyBetween(last, null),
        sorts: [],
        filters: [],
        groupBy: null,
        dateProperty: database.properties.find((p) => p.type === 'date')?.id ?? null,
        hiddenProperties: [],
      });
    }
  });
