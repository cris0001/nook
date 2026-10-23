import { Dexie, type EntityTable } from 'dexie';

import type { Content } from '@/schemas/content.schema';
import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

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
