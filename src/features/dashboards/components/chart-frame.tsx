import type { ReactNode } from 'react';

import { ticks } from '../utils/scale';

export const GUTTER = 28;
export const FOOT = 22;

export interface Point {
  key: string;
  label: string;
  value: number;
  tooltip: string;
}

// Y gridlines + tick labels + the x labels in `shownLabels`; the plot goes in `children`.
export function ChartFrame({
  width,
  height,
  max,
  points,
  xOf,
  shownLabels,
  children,
}: {
  width: number;
  height: number;
  max: number;
  points: Point[];
  xOf: (index: number) => number;
  shownLabels: (index: number) => boolean;
  children: ReactNode;
}) {
  const plot = height - FOOT;
  const yOf = (value: number) => plot - (value / max) * (plot - 8);

  return (
    <svg width={width} height={height} className="block overflow-visible">
      {ticks(max).map((tick) => (
        <g key={tick}>
          <line
            x1={GUTTER}
            x2={width}
            y1={yOf(tick)}
            y2={yOf(tick)}
            className="stroke-divider"
            strokeWidth={1}
          />
          <text
            x={GUTTER - 8}
            y={yOf(tick)}
            dy="0.32em"
            textAnchor="end"
            className="fill-muted-foreground font-mono text-[10px] tabular-nums"
          >
            {tick}
          </text>
        </g>
      ))}
      {points.map((point, i) =>
        shownLabels(i) ? (
          <text
            key={point.key}
            x={xOf(i)}
            y={height - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[10.5px]"
          >
            {point.label}
          </text>
        ) : null,
      )}
      {children}
    </svg>
  );
}
