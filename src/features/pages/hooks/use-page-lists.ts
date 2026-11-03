import { useSharedLiveQuery } from '@/hooks/use-shared-live-query';
import { listFavoritePages, listRecentPages } from '@/lib/data/pages';

const RECENT = 8;

export function useRecentPages() {
  return useSharedLiveQuery('pages:recent', () => listRecentPages(RECENT)) ?? [];
}

export function useFavoritePages() {
  return useSharedLiveQuery('pages:favorites', listFavoritePages) ?? [];
}
