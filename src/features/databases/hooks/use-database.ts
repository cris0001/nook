import { useLiveQuery } from 'dexie-react-hooks';

import { getDatabase, listRecords, listViews } from '@/lib/data/databases';
import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

export type DatabaseState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; database: Database; views: View[]; records: Page[] };

// A database with its views and records in one live query, so a change to any of the
// three re-renders the views together instead of in three separate passes.
export function useDatabase(id: string): DatabaseState {
  const data = useLiveQuery(async () => {
    const [database, views, records] = await Promise.all([
      getDatabase(id),
      listViews(id),
      listRecords(id),
    ]);
    return database ? { database, views, records } : null;
  }, [id]);

  if (data === undefined) {
    return { status: 'loading' };
  }
  return data ? { status: 'ready', ...data } : { status: 'missing' };
}
