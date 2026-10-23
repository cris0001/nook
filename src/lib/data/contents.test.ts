import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '@/lib/db';

import { getContent, saveContent } from './contents';
import { createPage, deletePageForever, duplicatePage, trashPage } from './pages';

const DOC = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hi' }] }],
};

beforeEach(async () => {
  await Promise.all([db.pages.clear(), db.contents.clear()]);
});

describe('contents', () => {
  it('saves and reads a page body', async () => {
    const page = await createPage({ parentId: null, type: 'document' });
    expect(await getContent(page.id)).toBeNull();
    await saveContent(page.id, DOC);
    expect(await getContent(page.id)).toEqual(DOC);
  });

  it('copies bodies when a page is duplicated', async () => {
    const page = await createPage({ parentId: null, type: 'document' });
    await saveContent(page.id, DOC);
    const copy = await duplicatePage(page.id);
    expect(await getContent(copy?.id ?? '')).toEqual(DOC);
  });

  it('removes the body when a page is deleted forever', async () => {
    const page = await createPage({ parentId: null, type: 'document' });
    await saveContent(page.id, DOC);
    await trashPage(page.id);
    await deletePageForever(page.id);
    expect(await db.contents.count()).toBe(0);
  });
});
