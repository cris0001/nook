import { liveQuery, type Subscription } from 'dexie';
import { useCallback, useSyncExternalStore } from 'react';

interface Entry {
  value: unknown;
  listeners: Set<() => void>;
  subscription: Subscription | null;
  teardown: number | undefined;
}

const KEEP_ALIVE_MS = 2000;
const entries = new Map<string, Entry>();

// One Dexie live query per key, shared by every component that asks for it: the sidebar
// badge and the Today screen read the same agenda instead of computing it twice. The
// subscription outlives its last reader briefly, so switching pages doesn't refetch.
export function useSharedLiveQuery<T>(key: string, query: () => Promise<T>): T | undefined {
  const subscribe = useCallback(
    (onChange: () => void) => {
      let entry = entries.get(key);
      if (!entry) {
        entry = { value: undefined, listeners: new Set(), subscription: null, teardown: undefined };
        entries.set(key, entry);
      }
      const current = entry;
      window.clearTimeout(current.teardown);
      current.listeners.add(onChange);
      current.subscription ??= liveQuery(query).subscribe({
        next: (value) => {
          current.value = value;
          current.listeners.forEach((listener) => listener());
        },
        error: (error: unknown) => console.error(error),
      });
      return () => {
        current.listeners.delete(onChange);
        if (current.listeners.size) return;
        current.teardown = window.setTimeout(() => {
          current.subscription?.unsubscribe();
          entries.delete(key);
        }, KEEP_ALIVE_MS);
      };
    },
    // The query is identified by its key; a new function for the same key is the same query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return useSyncExternalStore(subscribe, () => entries.get(key)?.value as T | undefined);
}
