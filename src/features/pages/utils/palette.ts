import type { Page } from '@/schemas/page.schema';

export interface PaletteEntry {
  page: Page;
  path: string;
}

function pathOf(byId: Map<string, Page>, page: Page, untitled: string): string {
  const chain: string[] = [];
  const seen = new Set([page.id]);
  let parent = page.parentId ? byId.get(page.parentId) : undefined;
  while (parent && !seen.has(parent.id)) {
    chain.unshift(parent.title || untitled);
    seen.add(parent.id);
    parent = parent.parentId ? byId.get(parent.parentId) : undefined;
  }
  return chain.join(' / ');
}

export function paletteEntries(pages: readonly Page[], untitled: string): PaletteEntry[] {
  const byId = new Map(pages.map((page) => [page.id, page]));
  return pages.map((page) => ({ page, path: pathOf(byId, page, untitled) }));
}

export const SEARCH_LIMIT = 30;

// Scores titles only, keeps the best few per group, and builds paths just for those —
// with ten thousand records the palette renders 60 rows, not all of them.
export function searchPalette(pages: readonly Page[], query: string, untitled: string) {
  const byId = new Map(pages.map((page) => [page.id, page]));
  const best = (list: Page[]) =>
    list
      .map((page) => ({ page, score: matchScore([page.title || untitled], query) }))
      .filter((hit) => hit.score > 0)
      .sort((a, b) => b.score - a.score || (b.page.lastOpenedAt ?? 0) - (a.page.lastOpenedAt ?? 0))
      .slice(0, SEARCH_LIMIT)
      .map(({ page }) => ({ page, path: pathOf(byId, page, untitled) }));
  return {
    navigation: best(pages.filter((page) => page.type !== 'record')),
    records: best(pages.filter((page) => page.type === 'record')),
  };
}

function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

// cmdk's default scorer also matches the item value, which here is a uuid — so short
// queries would hit random ids. Score on the keywords only: title words first.
export function matchScore(keywords: readonly string[], search: string): number {
  const needle = fold(search.trim());
  if (!needle) return 1;
  const [title = '', ...rest] = keywords.map(fold);
  if (title.startsWith(needle)) return 1;
  if (title.split(/\s+/).some((word) => word.startsWith(needle))) return 0.8;
  if (title.includes(needle)) return 0.6;
  return rest.some((k) => k.includes(needle)) ? 0.3 : 0;
}
