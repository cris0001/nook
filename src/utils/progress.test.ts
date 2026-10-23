import { describe, expect, it } from 'vitest';

import type { Database } from '@/schemas/database.schema';
import { makePage } from '@/test/make-page';

import { progressOf } from './progress';

const database: Database = {
  id: crypto.randomUUID(),
  properties: [
    { id: 'date', name: 'Date', type: 'date', options: [] },
    {
      id: 'status',
      name: 'Status',
      type: 'select',
      options: [
        { id: 'todo', name: 'To do', color: 'gray' },
        { id: 'done', name: 'Done', color: 'green' },
      ],
    },
  ],
};

describe('progressOf', () => {
  it('counts records in the last option of the first select', () => {
    const records = [
      makePage('a', 'db', { properties: { status: 'done' } }),
      makePage('b', 'db', { properties: { status: 'todo' } }),
      makePage('c', 'db'),
    ];
    expect(progressOf(database, records)).toEqual({ done: 1, total: 3 });
  });

  it('is null without records or without a status', () => {
    expect(progressOf(database, [])).toBeNull();
    expect(progressOf({ ...database, properties: [] }, [makePage('a', 'db')])).toBeNull();
  });
});
