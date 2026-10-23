import { describe, expect, it } from 'vitest';

import type { Page } from '@/schemas/page.schema';
import { makePage } from '@/test/make-page';

import { ancestorsOf, favoritesOf, recentOf } from './page-lists';

const ids = (pages: Page[]) => pages.map((p) => p.id);

describe('ancestorsOf', () => {
  it('lists ancestors from the root down', () => {
    const pages = [makePage('root', null), makePage('mid', 'root'), makePage('leaf', 'mid')];
    expect(ids(ancestorsOf(pages, 'leaf'))).toEqual(['root', 'mid']);
  });

  it('is empty for a root page', () => {
    expect(ancestorsOf([makePage('root', null)], 'root')).toEqual([]);
  });

  it('stops at a missing ancestor and survives cycles', () => {
    expect(ids(ancestorsOf([makePage('x', 'gone')], 'x'))).toEqual([]);
    const cyclic = [makePage('a', 'b'), makePage('b', 'a')];
    expect(ids(ancestorsOf(cyclic, 'a'))).toEqual(['b']);
  });
});

describe('favoritesOf / recentOf', () => {
  const pages = [
    makePage('old-star', null, { favoritedAt: 1, lastOpenedAt: 30 }),
    makePage('new-star', null, { favoritedAt: 5, lastOpenedAt: 10 }),
    makePage('plain', null, { lastOpenedAt: 20 }),
  ];

  it('orders favorites by when they were starred', () => {
    expect(ids(favoritesOf(pages))).toEqual(['old-star', 'new-star']);
  });

  it('orders recent pages newest first and honours the limit', () => {
    expect(ids(recentOf(pages, 2))).toEqual(['old-star', 'plain']);
  });
});
