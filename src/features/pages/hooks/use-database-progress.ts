import { useSharedLiveQuery } from '@/hooks/use-shared-live-query';
import { getDatabaseProgress } from '@/lib/data/databases';

export function useDatabaseProgress(databaseId: string) {
  return useSharedLiveQuery(`progress:${databaseId}`, () => getDatabaseProgress(databaseId));
}
