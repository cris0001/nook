import { describe, expect, it } from 'vitest';

import type { PropertyDef } from '@/schemas/database.schema';
import { makePage } from '@/test/make-page';

import { groupRecords, isOverdue, NO_GROUP, orderForDrop } from './board';

const STATUS: PropertyDef = {
  id: 'status',
  name: 'Status',
  type: 'select',
  options: [
    { id: 'todo', name: 'To do', color: 'gray' },
    { id: 'done', name: 'Done', color: 'green' },
  ],
};

const card = (id: string, status: string | null, order: string) =>
  makePage(id, 'db', { type: 'record', order, properties: { status } });

describe('groupRecords', () => {
  it('makes one column per option, in option order, keeping record order', () => {
    const columns = groupRecords(
      [card('a', 'done', 'a0'), card('b', 'todo', 'a1'), card('c', 'todo', 'a2')],
      STATUS,
    );
    expect(columns.map((c) => c.key)).toEqual(['todo', 'done']);
    expect(columns[0]?.records.map((r) => r.id)).toEqual(['b', 'c']);
  });

  it('adds a leading "no value" column only when needed', () => {
    const columns = groupRecords([card('x', null, 'a0'), card('y', 'gone', 'a1')], STATUS);
    expect(columns[0]?.key).toBe(NO_GROUP);
    expect(columns[0]?.records.map((r) => r.id)).toEqual(['x', 'y']);
  });
});

describe('orderForDrop', () => {
  const column = groupRecords(
    [card('a', 'todo', 'a0'), card('b', 'todo', 'a1'), card('c', 'todo', 'a2')],
    STATUS,
  )[0]!;

  it('places a card between the target and the card before it', () => {
    const order = orderForDrop(column, { columnKey: 'todo', beforeId: 'b' }, 'x');
    expect('a0' < order && order < 'a1').toBe(true);
  });

  it('appends at the end, ignoring the dragged card itself', () => {
    const order = orderForDrop(column, { columnKey: 'todo', beforeId: null }, 'c');
    expect(order > 'a1').toBe(true);
  });
});

describe('isOverdue', () => {
  it('flags past dates, but not in the last (done) column', () => {
    expect(isOverdue('2026-01-01', card('a', 'todo', 'a0'), STATUS, '2026-02-01')).toBe(true);
    expect(isOverdue('2026-01-01', card('a', 'done', 'a0'), STATUS, '2026-02-01')).toBe(false);
    expect(isOverdue('2026-03-01', card('a', 'todo', 'a0'), STATUS, '2026-02-01')).toBe(false);
  });
});
