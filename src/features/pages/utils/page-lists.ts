import type { Page } from '@/schemas/page.schema';

export function ancestorsOf(pages: readonly Page[], id: string): Page[] {
  const byId = new Map(pages.map((page) => [page.id, page]));
  const chain: Page[] = [];
  const seen = new Set([id]);
  let parentId = byId.get(id)?.parentId ?? null;
  while (parentId && !seen.has(parentId)) {
    const parent = byId.get(parentId);
    if (!parent) {
      break;
    }
    chain.unshift(parent);
    seen.add(parentId);
    parentId = parent.parentId;
  }
  return chain;
}

export function favoritesOf(pages: readonly Page[]): Page[] {
  return pages
    .filter((page) => page.favoritedAt !== null)
    .sort((a, b) => (a.favoritedAt ?? 0) - (b.favoritedAt ?? 0));
}

export function recentOf(pages: readonly Page[], limit: number): Page[] {
  return pages
    .filter((page) => page.lastOpenedAt !== null)
    .sort((a, b) => (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0))
    .slice(0, limit);
}
