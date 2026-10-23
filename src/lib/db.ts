import { Dexie, type EntityTable } from 'dexie';

import type { Page } from '@/schemas/page.schema';

// The whole workspace lives in one IndexedDB database. Only indexed fields go in the
// store definitions; the rest of each row is stored as-is. IndexedDB can't index null,
// so nullable fields (parentId at the root, deletedAt, …) aren't indexed — the page
// tree is small enough to load once and shape in memory. Bump the version with a new
// .stores() call whenever indexes change; Dexie migrates existing data.
export const db = new Dexie('nook') as Dexie & {
  pages: EntityTable<Page, 'id'>;
};

db.version(1).stores({
  pages: 'id, parentId, updatedAt',
});
