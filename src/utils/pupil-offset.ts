export interface Point {
  x: number;
  y: number;
}

// Where a pupil should sit (relative to its eye's center) to "look at" a target. The
// pupil moves along the line towards the target by up to `maxOffset` px. Targets
// closer than `reach` pull it proportionally less, so the eyes relax towards the
// center as the cursor approaches instead of snapping to the rim.
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
