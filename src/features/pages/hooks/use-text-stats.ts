import { useLiveQuery } from 'dexie-react-hooks';

import { getContent } from '@/lib/data/contents';
import { textStats } from '@/utils/text-stats';

export function useTextStats(pageId: string) {
  return useLiveQuery(async () => textStats(await getContent(pageId)), [pageId]);
}
