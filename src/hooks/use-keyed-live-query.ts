import { useLiveQuery } from 'dexie-react-hooks';

// useLiveQuery keeps returning the previous result while a query for new deps is still
// running. For a query about one id that means a moment of showing (and editing!) the
// previous page's data under the new page — so results for another key are dropped.
export function useKeyedLiveQuery<T>(key: string, query: () => Promise<T>): T | undefined {
  const result = useLiveQuery(async () => ({ key, value: await query() }), [key]);
  return result?.key === key ? result.value : undefined;
}
