import type { BoardElement } from '@/schemas/scene.schema';

import { bounds, type Handle } from '../utils/geometry';

export const HANDLES: Handle[] = ['nw', 'ne', 'sw', 'se'];
const PAD = 6;

export function handlePoint(
  box: ReturnType<typeof bounds>,
  handle: Handle,
  pad: number,
): [number, number] {
  const x = handle === 'nw' || handle === 'sw' ? box.x - pad : box.x + box.width + pad;
  const y = handle === 'nw' || handle === 'ne' ? box.y - pad : box.y + box.height + pad;
  return [x, y];
}

export function SelectionOverlay({ elements, zoom }: { elements: BoardElement[]; zoom: number }) {
  const pad = PAD / zoom;
  const only = elements.length === 1 ? elements[0] : undefined;
  return (
    <g pointerEvents="none">
      {elements.map((element) => {
        const box = bounds(element);
        return (
          <rect
            key={element.id}
            x={box.x - pad}
            y={box.y - pad}
            width={box.width + pad * 2}
            height={box.height + pad * 2}
            rx={4 / zoom}
            vectorEffect="non-scaling-stroke"
            strokeWidth={1.5}
            className="stroke-primary fill-none"
          />
        );
      })}
      {only
        ? HANDLES.map((handle) => {
            const [x, y] = handlePoint(bounds(only), handle, pad);
            return (
              <rect
                key={handle}
                x={x - 4 / zoom}
                y={y - 4 / zoom}
                width={8 / zoom}
                height={8 / zoom}
                rx={2 / zoom}
                vectorEffect="non-scaling-stroke"
                strokeWidth={1.5}
                className="stroke-primary fill-background"
              />
            );
          })
        : null}
    </g>
  );
}
