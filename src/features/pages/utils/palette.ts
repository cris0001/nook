import type { Page } from '@/schemas/page.schema';

import { ancestorsOf } from './page-lists';

export interface PaletteEntry {
  page: Page;
  path: string;
}

export function paletteEntries(pages: readonly Page[], untitled: string): PaletteEntry[] {
  return pages.map((page) => ({
    page,
    path: ancestorsOf(pages, page.id)
      .map((ancestor) => ancestor.title || untitled)
      .join(' / '),
  }));
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
