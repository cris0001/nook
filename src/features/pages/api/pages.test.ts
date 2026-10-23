import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { db } from '@/lib/db';

import { createPage, getPage, listPages, renamePage, restorePage, trashPage } from './pages';

// Each call to Date.now() moves time forward, so separate trash actions never share a
// timestamp (and therefore never share a restore batch) by accident.
let clock = 1_000;
vi.spyOn(Date, 'now').mockImplementation(() => (clock += 10));

beforeEach(async () => {
  await db.pages.clear();
});

describe('pages api', () => {
  it('appends new pages after their existing siblings', async () => {
    const first = await createPage({ parentId: null, type: 'document' });
    const second = await createPage({ parentId: null, type: 'document' });
    expect(first.order < second.order).toBe(true);
  });

  it('renames a page and bumps updatedAt', async () => {
    const page = await createPage({ parentId: null, type: 'document' });
    await renamePage(page.id, 'Roadmap');
    const renamed = await getPage(page.id);
    expect(renamed?.title).toBe('Roadmap');
    expect(renamed?.updatedAt).toBeGreaterThan(page.updatedAt);
  });

  it('trashes a page together with its descendants', async () => {
    const parent = await createPage({ parentId: null, type: 'document' });
    const child = await createPage({ parentId: parent.id, type: 'document' });
    await createPage({ parentId: child.id, type: 'document' });
    const other = await createPage({ parentId: null, type: 'document' });

    await trashPage(parent.id);

    expect((await listPages()).map((p) => p.id)).toEqual([other.id]);
  });

  it('restores only the batch trashed together', async () => {
    const parent = await createPage({ parentId: null, type: 'document' });
    const keptOut = await createPage({ parentId: parent.id, type: 'document' });
    const comesBack = await createPage({ parentId: parent.id, type: 'document' });

    await trashPage(keptOut.id);
    await trashPage(parent.id);
    await restorePage(parent.id);

    const ids = (await listPages()).map((p) => p.id);
    expect(ids).toContain(parent.id);
    expect(ids).toContain(comesBack.id);
    expect(ids).not.toContain(keptOut.id);
  });

  it('restores to the root when the old parent is still in the trash', async () => {
    const parent = await createPage({ parentId: null, type: 'document' });
    const child = await createPage({ parentId: parent.id, type: 'document' });

    await trashPage(child.id);
    await trashPage(parent.id);
    await restorePage(child.id);

    expect((await getPage(child.id))?.parentId).toBeNull();
  });
});
