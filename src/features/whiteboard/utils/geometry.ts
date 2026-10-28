import type { BoardElement } from '@/schemas/scene.schema';

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export type Handle = 'nw' | 'ne' | 'sw' | 'se';

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 4;
const LINE_HEIGHT = 1.25;
const CHAR_WIDTH = 0.55;

export function textSize(text: string, fontSize: number): { width: number; height: number } {
  const lines = text.split('\n');
  const longest = Math.max(1, ...lines.map((line) => line.length));
  return { width: longest * fontSize * CHAR_WIDTH, height: lines.length * fontSize * LINE_HEIGHT };
}

export function bounds(element: BoardElement): Box {
  switch (element.type) {
    case 'rectangle':
    case 'ellipse':
      return normalize({
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      });
    case 'text':
      return { x: element.x, y: element.y, ...textSize(element.text, element.fontSize) };
    default: {
      const xs = element.points.map((p) => p[0]);
      const ys = element.points.map((p) => p[1]);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      return {
        x: element.x + minX,
        y: element.y + minY,
        width: Math.max(...xs) - minX,
        height: Math.max(...ys) - minY,
      };
    }
  }
}

export function normalize(box: Box): Box {
  return {
    x: Math.min(box.x, box.x + box.width),
    y: Math.min(box.y, box.y + box.height),
    width: Math.abs(box.width),
    height: Math.abs(box.height),
  };
}

function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const length = dx * dx + dy * dy;
  const t = length ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / length)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function nearPolyline(
  points: readonly (readonly number[])[],
  x: number,
  y: number,
  px: number,
  py: number,
  tolerance: number,
) {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (
      a &&
      b &&
      distanceToSegment(
        px,
        py,
        x + (a[0] ?? 0),
        y + (a[1] ?? 0),
        x + (b[0] ?? 0),
        y + (b[1] ?? 0),
      ) <= tolerance
    ) {
      return true;
    }
  }
  return (
    points.length === 1 &&
    Math.hypot(px - x - (points[0]?.[0] ?? 0), py - y - (points[0]?.[1] ?? 0)) <= tolerance
  );
}

// Filled shapes and text hit anywhere inside; outlines and strokes only near the line.
export function hitTest(element: BoardElement, px: number, py: number, tolerance: number): boolean {
  const reach = tolerance + element.strokeWidth;
  const box = bounds(element);
  switch (element.type) {
    case 'text':
      return (
        px >= box.x - reach &&
        px <= box.x + box.width + reach &&
        py >= box.y - reach &&
        py <= box.y + box.height + reach
      );
    case 'rectangle': {
      const inside =
        px >= box.x && px <= box.x + box.width && py >= box.y && py <= box.y + box.height;
      if (element.fill && inside) return true;
      const corners: [number, number][] = [
        [box.x, box.y],
        [box.x + box.width, box.y],
        [box.x + box.width, box.y + box.height],
        [box.x, box.y + box.height],
        [box.x, box.y],
      ];
      return nearPolyline(corners, 0, 0, px, py, reach);
    }
    case 'ellipse': {
      const rx = box.width / 2;
      const ry = box.height / 2;
      if (rx === 0 || ry === 0) return false;
      const nx = (px - box.x - rx) / rx;
      const ny = (py - box.y - ry) / ry;
      const r = Math.hypot(nx, ny);
      if (element.fill && r <= 1) return true;
      return Math.abs(r - 1) * Math.min(rx, ry) <= reach;
    }
    default:
      return nearPolyline(element.points, element.x, element.y, px, py, reach);
  }
}

export function intersects(a: Box, b: Box): boolean {
  return (
    a.x <= b.x + b.width && b.x <= a.x + a.width && a.y <= b.y + b.height && b.y <= a.y + a.height
  );
}

export function toWorld(camera: Camera, sx: number, sy: number): [number, number] {
  return [(sx - camera.x) / camera.zoom, (sy - camera.y) / camera.zoom];
}

// Zooms keeping the screen point (sx, sy) over the same spot of the drawing.
export function zoomAt(camera: Camera, sx: number, sy: number, zoom: number): Camera {
  const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
  const [wx, wy] = toWorld(camera, sx, sy);
  return { zoom: next, x: sx - wx * next, y: sy - wy * next };
}

export function moveElement<T extends BoardElement>(element: T, dx: number, dy: number): T {
  return { ...element, x: element.x + dx, y: element.y + dy };
}

// Scales an element from its old bounds into `to`.
export function resizeElement<T extends BoardElement>(element: T, from: Box, to: Box): T {
  const sx = from.width ? to.width / from.width : 1;
  const sy = from.height ? to.height / from.height : 1;
  switch (element.type) {
    case 'rectangle':
    case 'ellipse':
      return { ...element, x: to.x, y: to.y, width: to.width, height: to.height };
    case 'text':
      return { ...element, x: to.x, y: to.y, fontSize: Math.max(8, element.fontSize * sy) };
    case 'pen':
      return {
        ...element,
        x: to.x + (element.x - from.x) * sx,
        y: to.y + (element.y - from.y) * sy,
        points: element.points.map(([x, y, p]) => [x * sx, y * sy, p] as [number, number, number]),
      };
    default:
      return {
        ...element,
        x: to.x + (element.x - from.x) * sx,
        y: to.y + (element.y - from.y) * sy,
        points: element.points.map(([x, y]) => [x * sx, y * sy] as [number, number]),
      };
  }
}

export function dragHandle(box: Box, handle: Handle, wx: number, wy: number): Box {
  const left = handle === 'nw' || handle === 'sw' ? wx : box.x;
  const right = handle === 'ne' || handle === 'se' ? wx : box.x + box.width;
  const top = handle === 'nw' || handle === 'ne' ? wy : box.y;
  const bottom = handle === 'sw' || handle === 'se' ? wy : box.y + box.height;
  return normalize({ x: left, y: top, width: right - left, height: bottom - top });
}
