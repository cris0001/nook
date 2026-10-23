import { describe, expect, it } from 'vitest';

import { monthGrid } from './month-grid';

describe('monthGrid', () => {
  it('starts on the configured weekday and spans 42 days', () => {
    const monday = monthGrid(new Date(2026, 9, 15), 1);
    expect(monday).toHaveLength(42);
    expect(monday[0]).toBe('2026-09-28');
    expect(monthGrid(new Date(2026, 9, 15), 0)[0]).toBe('2026-09-27');
  });

  it('contains every day of the month', () => {
    const grid = monthGrid(new Date(2026, 1, 1), 1);
    expect(grid).toContain('2026-02-01');
    expect(grid).toContain('2026-02-28');
  });
});
