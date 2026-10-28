import { getStroke } from 'perfect-freehand';
import { RoughGenerator } from 'roughjs/bin/generator';

import type { BoardElement } from '@/schemas/scene.schema';

export interface ShapePath {
  d: string;
  // 'stroke': an outline in the stroke color; 'hatch': fill hatching, stroked in the
  // fill color; 'solid': a filled outline in the stroke color (pen strokes).
  role: 'stroke' | 'hatch' | 'solid';
}

const generator = new RoughGenerator();
const STROKE = 'S';
const FILL = 'F';
const ARROW_ANGLE = Math.PI / 7;
const cache = new WeakMap<BoardElement, ShapePath[]>();

function rough(element: BoardElement, filled: boolean) {
  return {
    seed: element.seed,
    stroke: STROKE,
    strokeWidth: element.strokeWidth,
    roughness: 1.1,
    bowing: 1,
    ...(filled
      ? { fill: FILL, fillStyle: 'hachure', hachureGap: 6 + element.strokeWidth * 2 }
      : {}),
  };
}

function freehandPath(points: number[][]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return `M${first?.[0]},${first?.[1]}${rest.map(([x, y]) => `L${x},${y}`).join('')}Z`;
}

function build(element: BoardElement): ShapePath[] {
  if (element.type === 'text') return [];
  if (element.type === 'pen') {
    const outline = getStroke(element.points, {
      size: element.strokeWidth * 2.5 + 2,
      thinning: 0.55,
      smoothing: 0.5,
      streamline: 0.45,
      simulatePressure: element.points.every(([, , p]) => p === 0.5),
    });
    return [{ d: freehandPath(outline), role: 'solid' }];
  }

  let drawables;
  if (element.type === 'rectangle') {
    drawables = [
      generator.rectangle(
        0,
        0,
        element.width,
        element.height,
        rough(element, Boolean(element.fill)),
      ),
    ];
  } else if (element.type === 'ellipse') {
    drawables = [
      generator.ellipse(
        element.width / 2,
        element.height / 2,
        element.width,
        element.height,
        rough(element, Boolean(element.fill)),
      ),
    ];
  } else {
    const points = element.points;
    drawables = [generator.linearPath(points, rough(element, false))];
    const end = points.at(-1);
    const before = points.at(-2);
    if (element.type === 'arrow' && end && before) {
      const angle = Math.atan2(end[1] - before[1], end[0] - before[0]);
      const length = 12 + element.strokeWidth * 3;
      for (const side of [-1, 1]) {
        const a = angle + Math.PI + side * ARROW_ANGLE;
        drawables.push(
          generator.line(
            end[0],
            end[1],
            end[0] + Math.cos(a) * length,
            end[1] + Math.sin(a) * length,
            rough(element, false),
          ),
        );
      }
    }
  }

  return drawables.flatMap((drawable) =>
    generator.toPaths(drawable).map((path) => ({
      d: path.d,
      role: path.stroke === FILL ? ('hatch' as const) : ('stroke' as const),
    })),
  );
}

export function shapePaths(element: BoardElement): ShapePath[] {
  const cached = cache.get(element);
  if (cached) return cached;
  const paths = build(element);
  cache.set(element, paths);
  return paths;
}
