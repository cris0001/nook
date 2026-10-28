import { memo } from 'react';

import { cn } from '@/lib/utils';
import type { BoardElement } from '@/schemas/scene.schema';

import { INK_FILL, INK_STROKE } from '../utils/ink';
import { shapePaths } from '../utils/shape-paths';

export const ElementShape = memo(function ElementShape({
  element,
  hidden = false,
}: {
  element: BoardElement;
  hidden?: boolean;
}) {
  if (element.type === 'text') {
    return (
      <text
        x={element.x}
        y={element.y}
        fontSize={element.fontSize}
        className={cn(
          'font-medium whitespace-pre',
          INK_FILL[element.stroke],
          hidden && 'opacity-0',
        )}
      >
        {element.text.split('\n').map((line, i) => (
          <tspan key={i} x={element.x} dy={i === 0 ? '1em' : '1.25em'}>
            {line || ' '}
          </tspan>
        ))}
      </text>
    );
  }

  const fill = 'fill' in element ? element.fill : null;
  return (
    <g transform={`translate(${element.x} ${element.y})`}>
      {shapePaths(element).map((path, i) => (
        <path
          key={i}
          d={path.d}
          strokeWidth={
            path.role === 'hatch' ? Math.max(1, element.strokeWidth / 2) : element.strokeWidth
          }
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            path.role === 'solid' ? cn('stroke-none', INK_FILL[element.stroke]) : 'fill-none',
            path.role === 'stroke' && INK_STROKE[element.stroke],
            path.role === 'hatch' && fill && INK_STROKE[fill],
          )}
        />
      ))}
    </g>
  );
});
