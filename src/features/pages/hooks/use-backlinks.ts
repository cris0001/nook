import { useKeyedLiveQuery } from '@/hooks/use-keyed-live-query';
import { listBacklinks } from '@/lib/data/links';

export function useBacklinks(pageId: string) {
  return useKeyedLiveQuery(pageId, () => listBacklinks(pageId)) ?? [];
}
