import { useKeyedLiveQuery } from '@/hooks/use-keyed-live-query';
import { getDatabase, listRecords, listViews } from '@/lib/data/databases';
import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

export type DatabaseState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; database: Database; views: View[]; records: Page[] };

export function useDatabase(id: string): DatabaseState {
  const data = useKeyedLiveQuery(id, async () => {
    const [database, views, records] = await Promise.all([
      getDatabase(id),
      listViews(id),
      listRecords(id),
    ]);
    return database ? { database, views, records } : null;
  });

  if (data === undefined) {
    return { status: 'loading' };
  }
  return data ? { status: 'ready', ...data } : { status: 'missing' };
}
