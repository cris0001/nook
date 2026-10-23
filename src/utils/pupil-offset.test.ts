import { describe, expect, it } from 'vitest';

import { pupilOffset } from './pupil-offset';

const EYE = { x: 100, y: 100 };

describe('pupilOffset', () => {
  it('stays centered when the target is the eye center', () => {
    expect(pupilOffset(EYE, EYE, 10)).toEqual({ x: 0, y: 0 });
  });

  it('moves the full max offset towards a far target', () => {
    expect(pupilOffset(EYE, { x: 1000, y: 100 }, 10)).toEqual({ x: 10, y: 0 });
    expect(pupilOffset(EYE, { x: 100, y: -500 }, 10)).toEqual({ x: 0, y: -10 });
  });

  it('scales the offset down for targets within reach', () => {
    const { x, y } = pupilOffset(EYE, { x: 180, y: 100 }, 10, 160);
    expect(x).toBeCloseTo(5);
    expect(y).toBeCloseTo(0);
  });

  it('keeps the direction for diagonal targets', () => {
    const { x, y } = pupilOffset(EYE, { x: 1100, y: 1100 }, 10);
    expect(x).toBeCloseTo(y);
    expect(Math.hypot(x, y)).toBeCloseTo(10);
  });
});
