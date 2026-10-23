import { describe, expect, it } from 'vitest';

import { relativeDay } from './relative-day';

const TODAY = '2026-10-23';

describe('relativeDay', () => {
  it('names the near days', () => {
    expect(relativeDay('2026-10-23', TODAY)).toEqual({ kind: 'today' });
    expect(relativeDay('2026-10-24', TODAY)).toEqual({ kind: 'tomorrow' });
    expect(relativeDay('2026-10-27', TODAY)).toEqual({ kind: 'inDays', days: 4 });
  });

  it('counts days late for unfinished work only', () => {
    expect(relativeDay('2026-10-20', TODAY)).toEqual({ kind: 'late', days: 3 });
    expect(relativeDay('2026-10-20', TODAY, true)).toEqual({ kind: 'date' });
  });

  it('falls back to the date further out', () => {
    expect(relativeDay('2026-11-05', TODAY)).toEqual({ kind: 'date' });
  });
});
