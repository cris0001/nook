import { describe, expect, it } from 'vitest';

import { niceMax, ticks } from './scale';

describe('scale', () => {
  it('rounds the axis up to a clean number', () => {
    expect(niceMax(0)).toBe(4);
    expect(niceMax(3)).toBe(4);
    expect(niceMax(9)).toBe(12);
    expect(niceMax(37)).toBe(40);
  });

  it('spaces ticks evenly from zero', () => {
    expect(ticks(12)).toEqual([0, 3, 6, 9, 12]);
  });
});
