import { describe, expect, it } from 'vitest';

import type { Database } from '@/schemas/database.schema';
import { makePage } from '@/test/make-page';

import { computeMetrics } from './metrics';

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
    { id: 'due', name: 'Due', type: 'date', options: [] },
  ],
};

const at = (day: string) => new Date(`${day}T12:00:00`).getTime();
const TODAY = '2026-10-28';

const records = [
  makePage('a', 'db', {
    createdAt: at('2026-10-10'),
    properties: { status: 'todo', due: '2026-10-20' },
  }),
  makePage('b', 'db', {
    createdAt: at('2026-10-10'),
    properties: { status: 'todo', due: '2026-10-30' },
  }),
  makePage('c', 'db', {
    createdAt: at('2026-10-10'),
    doneAt: at('2026-10-27'),
    properties: { status: 'done', due: '2026-10-01' },
  }),
  makePage('d', 'db', {
    createdAt: at('2026-10-10'),
    doneAt: at('2026-10-20'),
    properties: { status: 'done' },
  }),
];

describe('computeMetrics', () => {
  const metrics = computeMetrics(database, records, TODAY);

  it('counts tiles, ignoring finished work for due dates', () => {
    expect(metrics).toMatchObject({
      total: 4,
      open: 2,
      overdue: 1,
      dueThisWeek: 1,
      doneRatio: 0.5,
    });
    expect(metrics.stages.map((s) => s.count)).toEqual([2, 2]);
  });

  it('buckets completions into Monday-first weeks', () => {
    expect(metrics.weekly).toHaveLength(8);
    expect(metrics.weekly.at(-1)).toEqual({ week: '2026-10-26', done: 1 });
    expect(metrics.weekly.at(-2)).toEqual({ week: '2026-10-19', done: 1 });
    expect(metrics.doneThisWeek).toBe(1);
  });

  it('burns down open work day by day', () => {
    const byDay = Object.fromEntries(metrics.burndown.map((p) => [p.day, p.open]));
    expect(byDay['2026-10-19']).toBe(4);
    expect(byDay['2026-10-20']).toBe(3);
    expect(byDay['2026-10-27']).toBe(2);
    expect(byDay[TODAY]).toBe(2);
  });
});
