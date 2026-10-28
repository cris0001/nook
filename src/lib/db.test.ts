import 'fake-indexeddb/auto';

import { Dexie } from 'dexie';
import { describe, expect, it } from 'vitest';

// Opens the real schema on top of a database left by an older version of the app.
describe('database migrations', () => {
  it('v5 adds a calendar view to databases created before it', async () => {
    const old = new Dexie('nook');
    old.version(4).stores({
      pages: 'id, parentId, updatedAt',
      databases: 'id',
      views: 'id, databaseId',
      contents: 'id',
      links: 'id, sourceId, targetId',
    });
    const databaseId = crypto.randomUUID();
    const dateId = crypto.randomUUID();
    await old.table('databases').add({
      id: databaseId,
      properties: [{ id: dateId, name: 'Date', type: 'date', options: [] }],
    });
    await old
      .table('views')
      .add({ id: crypto.randomUUID(), databaseId, type: 'table', order: 'a0' });
    old.close();

    const { db } = await import('./db');
    const views = await db.views.where('databaseId').equals(databaseId).toArray();
    const calendar = views.find((view) => view.type === 'calendar');
    expect(views).toHaveLength(2);
    expect(calendar?.dateProperty).toBe(dateId);
    expect(calendar && calendar.order > 'a0').toBe(true);
  });
});
