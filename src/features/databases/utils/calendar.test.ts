import { describe, expect, it } from 'vitest';

import { makePage } from '@/test/make-page';

import { recordsByDay, weekDays } from './calendar';

describe('weekDays', () => {
  it('returns the Monday-first week around a date', () => {
    expect(weekDays(new Date(2026, 9, 28), 1)).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ]);
  });
});

describe('recordsByDay', () => {
  it('buckets records by their date value and skips undated ones', () => {
    const records = [
      makePage('a', 'db', { properties: { due: '2026-10-28' } }),
      makePage('b', 'db', { properties: { due: '2026-10-28' } }),
      makePage('c', 'db', { properties: { due: '2026-10-30' } }),
      makePage('d', 'db'),
    ];
    const days = recordsByDay(records, 'due');
    expect(days.get('2026-10-28')?.map((r) => r.id)).toEqual(['a', 'b']);
    expect(days.get('2026-10-30')?.map((r) => r.id)).toEqual(['c']);
    expect(days.size).toBe(2);
  });
});
