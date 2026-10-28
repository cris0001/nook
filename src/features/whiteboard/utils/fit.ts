import type { BoardElement } from '@/schemas/scene.schema';

import { bounds, type Camera } from './geometry';

export function fitCamera(
  elements: BoardElement[],
  size: { width: number; height: number },
): Camera {
  if (!elements.length || !size.width) return { x: 0, y: 0, zoom: 1 };
  const boxes = elements.map(bounds);
  const minX = Math.min(...boxes.map((b) => b.x));
  const minY = Math.min(...boxes.map((b) => b.y));
  const width = Math.max(1, Math.max(...boxes.map((b) => b.x + b.width)) - minX);
  const height = Math.max(1, Math.max(...boxes.map((b) => b.y + b.height)) - minY);
  const roomX = size.width - Math.min(120, size.width * 0.12);
  const roomY = size.height - Math.min(160, size.height * 0.25);
  const zoom = Math.min(1.5, Math.max(0.2, Math.min(roomX / width, roomY / height)));
  return {
    zoom,
    x: size.width / 2 - (minX + width / 2) * zoom,
    y: size.height / 2 - (minY + height / 2) * zoom,
  };
}
