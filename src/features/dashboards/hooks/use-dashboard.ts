import { useKeyedLiveQuery } from '@/hooks/use-keyed-live-query';
import { getDashboard } from '@/lib/data/dashboards';
import { getDatabase, listRecords } from '@/lib/data/databases';
import { listPages } from '@/lib/data/pages';
import type { Database } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

export type DashboardState =
  | { status: 'loading' }
  | {
      status: 'ready';
      sources: Page[];
      source: { page: Page; database: Database; records: Page[] } | null;
    };

export function useDashboard(id: string): DashboardState {
  const data = useKeyedLiveQuery(id, async () => {
    const [dashboard, pages] = await Promise.all([getDashboard(id), listPages()]);
    const sources = pages.filter((page) => page.type === 'database');
    const page = sources.find((p) => p.id === dashboard?.sourceId);
    if (!page) return { sources, source: null };
    const [database, records] = await Promise.all([getDatabase(page.id), listRecords(page.id)]);
    return { sources, source: database ? { page, database, records } : null };
  });
  return data ? { status: 'ready', ...data } : { status: 'loading' };
}
