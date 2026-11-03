import { useMemo } from 'react';

import type { Page } from '@/schemas/page.schema';

import { buildPageTree, type PageNode } from '../utils/page-tree';
import { usePages } from './use-pages';

export type PageTreeState =
  { status: 'loading' } | { status: 'ready'; tree: PageNode[]; pages: Page[] };

export function usePageTree(): PageTreeState {
  const state = usePages();
  const pages = state.status === 'ready' ? state.pages : null;
  const tree = useMemo(() => (pages ? buildPageTree(pages) : null), [pages]);
  return pages && tree ? { status: 'ready', tree, pages } : { status: 'loading' };
}
