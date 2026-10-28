import { useKeyedLiveQuery } from '@/hooks/use-keyed-live-query';
import { getContent } from '@/lib/data/contents';
import { textStats } from '@/utils/text-stats';

export function useTextStats(pageId: string) {
  return useKeyedLiveQuery(pageId, async () => textStats(await getContent(pageId)));
}
