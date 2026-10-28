import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '@/lib/db';

import { exportWorkspace, importWorkspace } from './backup';
import { saveContent } from './contents';
import { addRecord, createDatabase } from './databases';
import { createPage, listPages } from './pages';

beforeEach(async () => {
  await Promise.all([
    db.pages.clear(),
    db.databases.clear(),
    db.views.clear(),
    db.contents.clear(),
  ]);
});

describe('workspace backup', () => {
  it('round-trips pages, databases, views and bodies', async () => {
    const doc = await createPage({ parentId: null, type: 'document', title: 'Notes' });
    await saveContent(doc.id, { type: 'doc', content: [] });
    const database = await createDatabase(null, 'Tasks');
    await addRecord(database.id, {}, 'Ship it');

    const backup = JSON.parse(JSON.stringify(await exportWorkspace())) as unknown;
    await createPage({ parentId: null, type: 'document', title: 'Will be replaced' });

    expect(await importWorkspace(backup)).toEqual({ ok: true, pages: 3 });
    expect((await listPages()).map((p) => p.title).sort()).toEqual(['Notes', 'Ship it', 'Tasks']);
    expect(await db.views.count()).toBe(2);
    expect(await db.contents.count()).toBe(1);
  });

  it('rejects files that are not a nOOk backup and keeps the data', async () => {
    await createPage({ parentId: null, type: 'document', title: 'Keep me' });
    expect(await importWorkspace({ format: 'other' })).toEqual({ ok: false, reason: 'invalid' });
    expect(await importWorkspace({ format: 'nook', version: 1, pages: [{ id: 1 }] })).toEqual({
      ok: false,
      reason: 'invalid',
    });
    expect((await listPages()).map((p) => p.title)).toEqual(['Keep me']);
  });
});
