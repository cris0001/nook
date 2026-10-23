import { describe, expect, it } from 'vitest';

import type { Page } from '@/schemas/page.schema';

import { buildPageTree } from './page-tree';

// Minimal page; the id doubles as the title so assertions read naturally.
function page(id: string, parentId: string | null, order: string): Page {
  return {
    id,
    parentId,
    type: 'document',
    title: id,
    icon: null,
    order,
    favoritedAt: null,
    lastOpenedAt: null,
    deletedAt: null,
    createdAt: 0,
    updatedAt: 0,
  };
}

const titles = (nodes: ReturnType<typeof buildPageTree>) => nodes.map((n) => n.page.title);

describe('buildPageTree', () => {
  it('nests children under their parent', () => {
    const tree = buildPageTree([page('root', null, 'a0'), page('child', 'root', 'a0')]);
    expect(titles(tree)).toEqual(['root']);
    expect(titles(tree[0]?.children ?? [])).toEqual(['child']);
  });

  it('orders siblings by their fractional key, not by insertion', () => {
    const tree = buildPageTree([
      page('c', null, 'a2'),
      page('a', null, 'a0'),
      page('b', null, 'a1'),
    ]);
    expect(titles(tree)).toEqual(['a', 'b', 'c']);
  });

  it('compares keys by code point (uppercase sorts before lowercase)', () => {
    const tree = buildPageTree([page('second', null, 'a0'), page('first', null, 'Zz')]);
    expect(titles(tree)).toEqual(['first', 'second']);
  });

  it('promotes orphans to the root instead of dropping them', () => {
    const tree = buildPageTree([page('orphan', 'missing-parent', 'a0')]);
    expect(titles(tree)).toEqual(['orphan']);
  });
});
