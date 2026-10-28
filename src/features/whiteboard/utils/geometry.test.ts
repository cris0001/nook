import { describe, expect, it } from 'vitest';

import type { BoardElement } from '@/schemas/scene.schema';

import { bounds, dragHandle, hitTest, resizeElement, toWorld, zoomAt } from './geometry';

const base = { id: 'e', stroke: 'ink', strokeWidth: 2, seed: 1 } as const;
const rect: BoardElement = {
  ...base,
  type: 'rectangle',
  x: 10,
  y: 10,
  width: 100,
  height: 50,
  fill: null,
};
const line: BoardElement = {
  ...base,
  type: 'line',
  x: 0,
  y: 0,
  points: [
    [0, 0],
    [100, 100],
  ],
};

describe('geometry', () => {
  it('normalizes boxes drawn up and to the left', () => {
    expect(bounds({ ...rect, width: -100, height: -50 })).toEqual({
      x: -90,
      y: -40,
      width: 100,
      height: 50,
    });
  });

  it('hits an empty rectangle only near its outline, a filled one anywhere', () => {
    expect(hitTest(rect, 10, 30, 4)).toBe(true);
    expect(hitTest(rect, 60, 35, 4)).toBe(false);
    expect(hitTest({ ...rect, fill: 'yellow' }, 60, 35, 4)).toBe(true);
  });

  it('hits lines by distance to the segment', () => {
    expect(hitTest(line, 52, 48, 4)).toBe(true);
    expect(hitTest(line, 80, 20, 4)).toBe(false);
  });

  it('zooms around the pointer', () => {
    const camera = zoomAt({ x: 0, y: 0, zoom: 1 }, 100, 100, 2);
    expect(toWorld(camera, 100, 100)).toEqual([100, 100]);
    expect(zoomAt(camera, 0, 0, 100).zoom).toBe(4);
  });

  it('resizes from a corner and scales line points', () => {
    const box = bounds(line);
    const to = dragHandle(box, 'se', 200, 50);
    expect(to).toEqual({ x: 0, y: 0, width: 200, height: 50 });
    const resized = resizeElement(line, box, to);
    expect(resized.type === 'line' && resized.points).toEqual([
      [0, 0],
      [200, 50],
    ]);
  });
});
