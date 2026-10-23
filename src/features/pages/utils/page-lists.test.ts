import { describe, expect, it } from 'vitest';

import type { Page } from '@/schemas/page.schema';

import { ancestorsOf, favoritesOf, recentOf } from './page-lists';

function page(id: string, parentId: string | null, extra: Partial<Page> = {}): Page {
  return {
    id,
    parentId,
    type: 'document',
    title: id,
    icon: null,
    order: 'a0',
    favoritedAt: null,
    lastOpenedAt: null,
    deletedAt: null,
    createdAt: 0,
    updatedAt: 0,
    ...extra,
  };
}

const ids = (pages: Page[]) => pages.map((p) => p.id);

describe('ancestorsOf', () => {
  it('lists ancestors from the root down', () => {
    const pages = [page('root', null), page('mid', 'root'), page('leaf', 'mid')];
    expect(ids(ancestorsOf(pages, 'leaf'))).toEqual(['root', 'mid']);
  });

  it('is empty for a root page', () => {
    expect(ancestorsOf([page('root', null)], 'root')).toEqual([]);
  });

  it('stops at a missing ancestor and survives cycles', () => {
    expect(ids(ancestorsOf([page('x', 'gone')], 'x'))).toEqual([]);
    const cyclic = [page('a', 'b'), page('b', 'a')];
    expect(ids(ancestorsOf(cyclic, 'a'))).toEqual(['b']);
  });
});

describe('favoritesOf / recentOf', () => {
  const pages = [
    page('old-star', null, { favoritedAt: 1, lastOpenedAt: 30 }),
    page('new-star', null, { favoritedAt: 5, lastOpenedAt: 10 }),
    page('plain', null, { lastOpenedAt: 20 }),
  ];

  it('orders favorites by when they were starred', () => {
    expect(ids(favoritesOf(pages))).toEqual(['old-star', 'new-star']);
  });

  it('orders recent pages newest first and honours the limit', () => {
    expect(ids(recentOf(pages, 2))).toEqual(['old-star', 'plain']);
  });
});
