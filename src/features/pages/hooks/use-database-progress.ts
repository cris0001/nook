import { useLiveQuery } from 'dexie-react-hooks';

import { getDatabaseProgress } from '@/lib/data/databases';

export function useDatabaseProgress(databaseId: string) {
  return useLiveQuery(() => getDatabaseProgress(databaseId), [databaseId]);
}
