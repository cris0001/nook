import { db } from '@/lib/db';
import type { Dashboard } from '@/schemas/dashboard.schema';
import type { Page } from '@/schemas/page.schema';

import { createPage, listPages } from './pages';

export async function createDashboard(parentId: string | null, title = ''): Promise<Page> {
  return db.transaction('rw', db.pages, db.dashboards, async () => {
    const source = (await listPages()).find((page) => page.type === 'database');
    const page = await createPage({ parentId, type: 'dashboard', title });
    await db.dashboards.add({ id: page.id, sourceId: source?.id ?? null });
    return page;
  });
}

export function getDashboard(id: string): Promise<Dashboard | undefined> {
  return db.dashboards.get(id);
}

export async function setDashboardSource(id: string, sourceId: string | null): Promise<void> {
  await db.dashboards.put({ id, sourceId });
}
