import { useMemo } from 'react';

import { buildPageTree, type PageNode } from '../utils/page-tree';
import { usePages } from './use-pages';

export type PageTreeState = { status: 'loading' } | { status: 'ready'; tree: PageNode[] };

// The live page list shaped into the sidebar tree.
export function usePageTree(): PageTreeState {
  const state = usePages();
  const pages = state.status === 'ready' ? state.pages : null;
  const tree = useMemo(() => (pages ? buildPageTree(pages) : null), [pages]);
  return tree ? { status: 'ready', tree } : { status: 'loading' };
}
