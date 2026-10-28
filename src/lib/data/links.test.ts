import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '@/lib/db';

import { saveContent } from './contents';
import { listBacklinks } from './links';
import { createPage, deletePageForever, duplicatePage, trashPage } from './pages';

const mention = (id: string) => ({ type: 'mention', attrs: { id, label: '' } });
const docWith = (...ids: string[]) => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: ids.map(mention) }],
});

beforeEach(async () => {
  await Promise.all([db.pages.clear(), db.contents.clear(), db.links.clear()]);
});

describe('backlinks', () => {
  it('lists pages whose body mentions the target, following edits', async () => {
    const target = await createPage({ parentId: null, type: 'document', title: 'Target' });
    const a = await createPage({ parentId: null, type: 'document', title: 'A' });
    const b = await createPage({ parentId: null, type: 'document', title: 'B' });

    await saveContent(a.id, docWith(target.id, target.id));
    await saveContent(b.id, docWith(target.id, b.id));
    expect((await listBacklinks(target.id)).map((p) => p.title).sort()).toEqual(['A', 'B']);
    expect(await listBacklinks(b.id)).toEqual([]);

    await saveContent(a.id, docWith());
    expect((await listBacklinks(target.id)).map((p) => p.title)).toEqual(['B']);
  });

  it('hides trashed sources, drops deleted ones and indexes duplicates', async () => {
    const target = await createPage({ parentId: null, type: 'document', title: 'Target' });
    const source = await createPage({ parentId: null, type: 'document', title: 'Source' });
    await saveContent(source.id, docWith(target.id));

    const copy = await duplicatePage(source.id);
    expect((await listBacklinks(target.id)).length).toBe(2);

    await trashPage(source.id);
    expect((await listBacklinks(target.id)).map((p) => p.id)).toEqual([copy?.id]);

    await deletePageForever(source.id);
    expect(await db.links.where('sourceId').equals(source.id).count()).toBe(0);
  });
});
