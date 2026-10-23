export interface Point {
  x: number;
  y: number;
}

export function pupilOffset(eye: Point, target: Point, maxOffset: number, reach = 160): Point {
  const dx = target.x - eye.x;
  const dy = target.y - eye.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  const travel = maxOffset * Math.min(distance / reach, 1);
  return { x: (dx / distance) * travel, y: (dy / distance) * travel };
}
