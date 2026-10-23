import { describe, expect, it } from 'vitest';

import type { Database } from '@/schemas/database.schema';
import { makePage } from '@/test/make-page';

import { summarize } from './summary';

const database: Database = {
  id: crypto.randomUUID(),
  properties: [
    {
      id: 'status',
      name: 'Status',
      type: 'select',
      options: [
        { id: 'todo', name: 'To do', color: 'gray' },
        { id: 'done', name: 'Done', color: 'green' },
      ],
    },
    { id: 'date', name: 'Date', type: 'date', options: [] },
  ],
};

describe('summarize', () => {
  it('counts stages, overdue and this week, skipping finished work', () => {
    const records = [
      makePage('a', 'db', { properties: { status: 'todo', date: '2026-10-20' } }),
      makePage('b', 'db', { properties: { status: 'todo', date: '2026-10-25' } }),
      makePage('c', 'db', { properties: { status: 'done', date: '2026-10-01' } }),
      makePage('d', 'db'),
    ];
    const summary = summarize(database, records, '2026-10-23');
    expect(summary.total).toBe(4);
    expect(summary.overdue).toBe(1);
    expect(summary.dueThisWeek).toBe(1);
    expect(summary.stages.map((s) => s.count)).toEqual([2, 1]);
    expect(summary.doneRatio).toBe(0.25);
  });
});
