import { useMemo } from 'react';

import type { Page } from '@/schemas/page.schema';

import { buildPageTree, type PageNode } from '../utils/page-tree';
import { usePages } from './use-pages';

export type PageTreeState =
  { status: 'loading' } | { status: 'ready'; tree: PageNode[]; pages: Page[] };

// The live page list shaped into the sidebar tree. Database records are left out —
// they live inside their database's views, not in the navigation. The flat list rides
// along for lookups the tree is awkward for (drag-and-drop planning).
export function usePageTree(): PageTreeState {
  const state = usePages();
  const all = state.status === 'ready' ? state.pages : null;
  const pages = useMemo(() => all?.filter((page) => page.type !== 'record') ?? null, [all]);
  const tree = useMemo(() => (pages ? buildPageTree(pages) : null), [pages]);
  return pages && tree ? { status: 'ready', tree, pages } : { status: 'loading' };
}
