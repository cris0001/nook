import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';

import { listPages } from '@/lib/data/pages';
import type { Page } from '@/schemas/page.schema';

import { matchesQuery } from '../utils/slash-items';

const LIMIT = 8;

export interface MentionCandidate {
  page: Page;
  path: string;
}

export function useMentionCandidates(query: string, excludeId: string): MentionCandidate[] {
  const pages = useLiveQuery(listPages, []);
  return useMemo(() => {
    if (!pages) return [];
    const byId = new Map(pages.map((page) => [page.id, page]));
    const needle = query.trim().toLowerCase();
    return pages
      .filter((page) => page.id !== excludeId && matchesQuery(page.title, query))
      .sort((a, b) => {
        const prefix = (p: Page) => (p.title.toLowerCase().startsWith(needle) ? 0 : 1);
        return prefix(a) - prefix(b) || (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0);
      })
      .slice(0, LIMIT)
      .map((page) => ({
        page,
        path: (page.parentId ? byId.get(page.parentId)?.title : undefined) ?? '',
      }));
  }, [pages, query, excludeId]);
}
