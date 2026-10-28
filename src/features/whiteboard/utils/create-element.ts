import type { BoardElement } from '@/schemas/scene.schema';

import type { Style, Tool } from '../stores/whiteboard.store';
import { bounds, normalize } from './geometry';

export const TEXT_SIZE = 20;
const MIN_SIZE = 3;

const newSeed = () => Math.floor(Math.random() * 2 ** 31);

export function newElement(
  tool: Tool,
  style: Style,
  x: number,
  y: number,
  pressure: number,
): BoardElement | null {
  const base = {
    id: crypto.randomUUID(),
    x,
    y,
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    seed: newSeed(),
  };
  switch (tool) {
    case 'rectangle':
    case 'ellipse':
      return { ...base, type: tool, width: 0, height: 0, fill: style.fill };
    case 'line':
    case 'arrow':
      return {
        ...base,
        type: tool,
        points: [
          [0, 0],
          [0, 0],
        ],
      };
    case 'pen':
      return { ...base, type: 'pen', points: [[0, 0, pressure]] };
    case 'text':
      return { ...base, type: 'text', text: '', fontSize: TEXT_SIZE };
    default:
      return null;
  }
}

export function extendElement(
  element: BoardElement,
  wx: number,
  wy: number,
  pressure: number,
): BoardElement {
  const dx = wx - element.x;
  const dy = wy - element.y;
  switch (element.type) {
    case 'rectangle':
    case 'ellipse':
      return { ...element, width: dx, height: dy };
    case 'line':
    case 'arrow':
      return {
        ...element,
        points: [
          [0, 0],
          [dx, dy],
        ],
      };
    case 'pen':
      return { ...element, points: [...element.points, [dx, dy, pressure]] };
    default:
      return element;
  }
}

// Boxes drawn up/left get positive sizes; accidental clicks (no size) are dropped.
export function finishElement(element: BoardElement): BoardElement | null {
  const box = bounds(element);
  if (element.type === 'rectangle' || element.type === 'ellipse') {
    if (box.width < MIN_SIZE && box.height < MIN_SIZE) return null;
    const { x, y, width, height } = normalize(element);
    return { ...element, x, y, width, height };
  }
  if (element.type === 'line' || element.type === 'arrow') {
    return Math.hypot(box.width, box.height) < MIN_SIZE ? null : element;
  }
  return element;
}
