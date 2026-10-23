import type { Page } from '@/schemas/page.schema';

export interface PageNode {
  page: Page;
  children: PageNode[];
}

// Fractional-index keys compare by plain code points — not localeCompare, which
// would order them by locale rules and break the "between" guarantee.
export function byOrder(a: Page, b: Page): number {
  if (a.order === b.order) {
    return 0;
  }
  return a.order < b.order ? -1 : 1;
}

// Shapes a flat list of pages into the sidebar tree, siblings in order. A page whose
// parent isn't in the list (e.g. still in the trash) is treated as a root, so nothing
// silently disappears from the sidebar.
export function buildPageTree(pages: readonly Page[]): PageNode[] {
  const nodes = new Map(pages.map((page) => [page.id, { page, children: [] as PageNode[] }]));
  const roots: PageNode[] = [];

  for (const node of [...nodes.values()].sort((a, b) => byOrder(a.page, b.page))) {
    const parent = node.page.parentId ? nodes.get(node.page.parentId) : undefined;
    (parent ? parent.children : roots).push(node);
  }

  return roots;
}
