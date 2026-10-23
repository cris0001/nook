import { useLiveQuery } from 'dexie-react-hooks';

import { getDatabaseProgress } from '@/lib/data/databases';

// Live done/total for a database page; re-counts as soon as a record changes status.
// Undefined while loading, null when there's nothing to measure.
export function useDatabaseProgress(databaseId: string) {
  return useLiveQuery(() => getDatabaseProgress(databaseId), [databaseId]);
}
