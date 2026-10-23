import { describe, expect, it } from 'vitest';

import type { Database } from '@/schemas/database.schema';
import { makePage } from '@/test/make-page';

import { buildAgenda } from './agenda';

const DB: Database = {
  id: '00000000-0000-4000-8000-000000000001',
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
    { id: 'due', name: 'Due', type: 'date', options: [] },
  ],
};

const rec = (title: string, due: string | null, status = 'todo') =>
  makePage(title, 'db', { type: 'record', title, properties: { status, due } });

const source = (records: ReturnType<typeof rec>[]) => [
  { page: makePage('db', null, { type: 'database', title: 'Tasks' }), database: DB, records },
];

const titles = (items: { record: { title: string } }[]) => items.map((i) => i.record.title);

describe('buildAgenda', () => {
  const agenda = buildAgenda(
    source([
      rec('Late', '2026-10-20'),
      rec('Now', '2026-10-23'),
      rec('Soon B', '2026-10-27'),
      rec('Soon A', '2026-10-27'),
      rec('Last day', '2026-10-29'),
      rec('Too far', '2026-10-30'),
      rec('No date', null),
      rec('Finished late', '2026-10-01', 'done'),
    ]),
    '2026-10-23',
  );

  it('buckets dated, unfinished records into overdue / today / this week', () => {
    expect(titles(agenda.overdue)).toEqual(['Late']);
    expect(titles(agenda.today)).toEqual(['Now']);
    expect(titles(agenda.week)).toEqual(['Soon A', 'Soon B', 'Last day']);
  });

  it('knows how to complete an item and computes the done ratio', () => {
    expect(agenda.today[0]?.complete).toEqual({ propertyId: 'status', optionId: 'done' });
    expect(agenda.doneRatio).toBeCloseTo(1 / 8);
  });
});
