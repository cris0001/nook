import { db } from '@/lib/db';
import { BACKUP_VERSION, BackupSchema, type Backup } from '@/schemas/backup.schema';

import { rebuildLinks } from './links';

export type ImportResult = { ok: true; pages: number } | { ok: false; reason: 'invalid' };

export async function exportWorkspace(): Promise<Backup> {
  const [pages, databases, views, contents, dashboards] = await Promise.all([
    db.pages.toArray(),
    db.databases.toArray(),
    db.views.toArray(),
    db.contents.toArray(),
    db.dashboards.toArray(),
  ]);
  return {
    format: 'nook',
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    pages,
    databases,
    views,
    contents,
    dashboards,
  };
}

// Replaces the whole workspace in one transaction: a file that fails validation never
// touches the current data, and a valid one never leaves it half-imported.
export async function importWorkspace(input: unknown): Promise<ImportResult> {
  const parsed = BackupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: 'invalid' };
  }
  const backup = parsed.data;
  await db.transaction(
    'rw',
    [db.pages, db.databases, db.views, db.contents, db.links, db.dashboards],
    async () => {
      await Promise.all([
        db.pages.clear(),
        db.databases.clear(),
        db.views.clear(),
        db.contents.clear(),
        db.dashboards.clear(),
      ]);
      await Promise.all([
        db.pages.bulkAdd(backup.pages),
        db.databases.bulkAdd(backup.databases),
        db.views.bulkAdd(backup.views),
        db.contents.bulkAdd(backup.contents),
        db.dashboards.bulkAdd(backup.dashboards),
      ]);
      await rebuildLinks();
    },
  );
  return { ok: true, pages: backup.pages.length };
}
