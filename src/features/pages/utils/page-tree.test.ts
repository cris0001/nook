import { describe, expect, it } from 'vitest';

import { makePage } from '@/test/make-page';

import { buildPageTree } from './page-tree';

const titles = (nodes: ReturnType<typeof buildPageTree>) => nodes.map((n) => n.page.title);

describe('buildPageTree', () => {
  it('nests children under their parent', () => {
    const tree = buildPageTree([
      makePage('root', null, { order: 'a0' }),
      makePage('child', 'root', { order: 'a0' }),
    ]);
    expect(titles(tree)).toEqual(['root']);
    expect(titles(tree[0]?.children ?? [])).toEqual(['child']);
  });

  it('orders siblings by their fractional key, not by insertion', () => {
    const tree = buildPageTree([
      makePage('c', null, { order: 'a2' }),
      makePage('a', null, { order: 'a0' }),
      makePage('b', null, { order: 'a1' }),
    ]);
    expect(titles(tree)).toEqual(['a', 'b', 'c']);
  });

  it('compares keys by code point (uppercase sorts before lowercase)', () => {
    const tree = buildPageTree([
      makePage('second', null, { order: 'a0' }),
      makePage('first', null, { order: 'Zz' }),
    ]);
    expect(titles(tree)).toEqual(['first', 'second']);
  });

  it('promotes orphans to the root instead of dropping them', () => {
    const tree = buildPageTree([makePage('orphan', 'missing-parent', { order: 'a0' })]);
    expect(titles(tree)).toEqual(['orphan']);
  });
});
