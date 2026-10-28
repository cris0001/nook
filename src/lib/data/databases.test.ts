import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '@/lib/db';

import {
  addOption,
  addProperty,
  addRecord,
  createDatabase,
  deleteOption,
  deleteView,
  deleteProperty,
  getDatabase,
  listRecords,
  listViews,
  reorderOptions,
  setRecordValue,
  toggleRecordOption,
  updateOption,
} from './databases';
import { deletePageForever, duplicatePage, getPage, trashPage } from './pages';

beforeEach(async () => {
  await Promise.all([db.pages.clear(), db.databases.clear(), db.views.clear()]);
});

describe('databases data', () => {
  it('creates a database with Status + Date and table, board and calendar views', async () => {
    const page = await createDatabase(null, 'Tasks');
    const database = await getDatabase(page.id);
    const status = database?.properties.find((p) => p.name === 'Status');

    expect(database?.properties.map((p) => p.type)).toEqual(['select', 'date']);
    expect(status?.options.map((o) => o.name)).toEqual(['To do', 'In progress', 'Done']);
    const views = await listViews(page.id);
    expect(views.map((v) => v.type)).toEqual(['table', 'board', 'calendar']);
    expect(views[1]?.groupBy).toBe(status?.id);
    expect(views[2]?.dateProperty).toBe(database?.properties[1]?.id);
  });

  it('adds records and stores cell values by property id', async () => {
    const database = await createDatabase(null);
    const record = await addRecord(database.id, {}, 'Write spec');
    const text = await addProperty(database.id, 'text', 'Notes');
    await setRecordValue(record.id, text.id, 'draft first');

    const [stored] = await listRecords(database.id);
    expect(stored?.title).toBe('Write spec');
    expect(stored?.properties[text.id]).toBe('draft first');
  });

  it('adds select options with rotating colors', async () => {
    const database = await createDatabase(null);
    const tags = await addProperty(database.id, 'multiSelect', 'Tags');
    const first = await addOption(database.id, tags.id, 'urgent');
    const second = await addOption(database.id, tags.id, 'later');
    expect(first.color).not.toBe(second.color);
  });

  it('deleting a property cleans record values and view references', async () => {
    const database = await createDatabase(null);
    const status = (await getDatabase(database.id))?.properties[0];
    const record = await addRecord(database.id);
    await setRecordValue(record.id, status?.id ?? '', 'x');

    await deleteProperty(database.id, status?.id ?? '');

    expect((await listRecords(database.id))[0]?.properties).toEqual({});
    expect((await listViews(database.id))[1]?.groupBy).toBeNull();
  });

  it('duplicates a database with its columns, views and records', async () => {
    const database = await createDatabase(null, 'Tasks');
    await addRecord(database.id, {}, 'One');

    const copy = await duplicatePage(database.id);

    expect((await getDatabase(copy?.id ?? ''))?.properties).toHaveLength(2);
    expect(await listViews(copy?.id ?? '')).toHaveLength(3);
    expect((await listRecords(copy?.id ?? '')).map((r) => r.title)).toEqual(['One']);
  });

  it('deleting a database forever removes its columns and views', async () => {
    const database = await createDatabase(null);
    await trashPage(database.id);
    await deletePageForever(database.id);

    expect(await db.databases.count()).toBe(0);
    expect(await db.views.count()).toBe(0);
  });

  it('toggles options on the stored value, so quick picks accumulate', async () => {
    const database = await createDatabase(null);
    const tags = await addProperty(database.id, 'multiSelect', 'Tags');
    const record = await addRecord(database.id);
    await Promise.all([
      toggleRecordOption(record.id, tags.id, 'a', true),
      toggleRecordOption(record.id, tags.id, 'b', true),
    ]);
    expect((await listRecords(database.id))[0]?.properties[tags.id]).toEqual(['a', 'b']);
  });

  it('keeps both options when two are created at once', async () => {
    const database = await createDatabase(null);
    const tags = await addProperty(database.id, 'multiSelect', 'Tags');
    await Promise.all([
      addOption(database.id, tags.id, 'design'),
      addOption(database.id, tags.id, 'web'),
    ]);
    const stored = (await getDatabase(database.id))?.properties.find((p) => p.id === tags.id);
    expect(stored?.options.map((o) => o.name).sort()).toEqual(['design', 'web']);
  });

  it('renames, recolors and reorders options', async () => {
    const database = await createDatabase(null);
    const status = (await getDatabase(database.id))!.properties[0]!;
    const [todo, doing, done] = status.options;

    await updateOption(database.id, status.id, todo!.id, { name: 'Backlog', color: 'purple' });
    await reorderOptions(database.id, status.id, [done!.id, doing!.id, todo!.id]);

    const options = (await getDatabase(database.id))!.properties[0]!.options;
    expect(options.map((o) => o.name)).toEqual(['Done', 'In progress', 'Backlog']);
    expect(options[2]?.color).toBe('purple');
  });

  it('deleting an option clears it from records and filters', async () => {
    const database = await createDatabase(null);
    const status = (await getDatabase(database.id))!.properties[0]!;
    const todo = status.options[0]!;
    const tags = await addProperty(database.id, 'multiSelect', 'Tags');
    const a = await addOption(database.id, tags.id, 'a');
    const b = await addOption(database.id, tags.id, 'b');
    await addRecord(database.id, { [status.id]: todo.id, [tags.id]: [a.id, b.id] });
    const [table] = await listViews(database.id);
    await db.views.update(table!.id, {
      filters: [{ id: 'f', propertyId: status.id, operator: 'is', value: todo.id }],
    });

    await deleteOption(database.id, status.id, todo.id);
    await deleteOption(database.id, tags.id, a.id);

    const [record] = await listRecords(database.id);
    expect(record?.properties[status.id]).toBeNull();
    expect(record?.properties[tags.id]).toEqual([b.id]);
    expect((await listViews(database.id))[0]?.filters).toEqual([]);
  });

  it('deletes views but always keeps the last one', async () => {
    const database = await createDatabase(null);
    const [table, board, calendar] = await listViews(database.id);
    await deleteView(calendar!.id);
    await deleteView(board!.id);
    await deleteView(table!.id);
    expect((await listViews(database.id)).map((v) => v.id)).toEqual([table!.id]);
  });
});

describe('done tracking', () => {
  it('stamps doneAt when a record enters the last status and clears it on leaving', async () => {
    const database = await createDatabase(null);
    const status = (await getDatabase(database.id))?.properties[0];
    const [todo, , done] = status?.options ?? [];
    const record = await addRecord(database.id, {}, 'Task');

    await setRecordValue(record.id, status!.id, done!.id);
    const finished = await getPage(record.id);
    expect(finished?.doneAt).toBeTypeOf('number');

    await setRecordValue(record.id, status!.id, todo!.id);
    expect((await getPage(record.id))?.doneAt).toBeNull();
  });

  it('stamps records created straight into done', async () => {
    const database = await createDatabase(null);
    const status = (await getDatabase(database.id))?.properties[0];
    const record = await addRecord(database.id, { [status!.id]: status!.options[2]!.id });
    expect((await getPage(record.id))?.doneAt).toBeTypeOf('number');
  });
});
