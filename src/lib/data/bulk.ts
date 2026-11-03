import type { JSONContent } from '@tiptap/react';

import { db } from '@/lib/db';
import type { Content } from '@/schemas/content.schema';
import type { Dashboard } from '@/schemas/dashboard.schema';
import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import type { Scene } from '@/schemas/scene.schema';

import { writeLinks } from './links';

export interface WorkspaceRows {
  pages: Page[];
  databases: Database[];
  views: View[];
  contents: Content[];
  dashboards: Dashboard[];
  scenes: Scene[];
}

const TABLES = () => [
  db.pages,
  db.databases,
  db.views,
  db.contents,
  db.links,
  db.dashboards,
  db.scenes,
];

// One transaction for everything: thousands of rows land in a single write, and the
// live queries re-run once instead of once per row.
export async function insertRows(rows: WorkspaceRows): Promise<void> {
  await db.transaction('rw', TABLES(), async () => {
    await db.pages.bulkAdd(rows.pages);
    await db.databases.bulkAdd(rows.databases);
    await db.views.bulkAdd(rows.views);
    await db.contents.bulkAdd(rows.contents);
    await db.dashboards.bulkAdd(rows.dashboards);
    await db.scenes.bulkAdd(rows.scenes);
    for (const content of rows.contents) await writeLinks(content.id, content.doc as JSONContent);
  });
}

export async function lastRootOrder(): Promise<string | null> {
  const roots = await db.pages.filter((page) => page.parentId === null).toArray();
  return (
    roots
      .map((page) => page.order)
      .sort()
      .at(-1) ?? null
  );
}

export async function clearWorkspace(): Promise<void> {
  await db.transaction('rw', TABLES(), async () => {
    await Promise.all(TABLES().map((table) => table.clear()));
  });
}
