import { useState } from 'react';

import { cn } from '@/lib/utils';

import { useWidth } from '../hooks/use-width';
import { niceMax } from '../utils/scale';
import { ChartFrame, FOOT, GUTTER, type Point } from './chart-frame';
import { ChartTable } from './chart-table';
import { ChartTooltip } from './chart-tooltip';

const HEIGHT = 200;
const MAX_BAR = 24;
const RADIUS = 4;

// Rounded at the data end, square on the baseline.
function columnPath(x: number, y: number, w: number, base: number): string {
  const r = Math.min(RADIUS, w / 2, base - y);
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`;
}

export function ColumnChart({ points, label }: { points: Point[]; label: string }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const width = useWidth(element);
  const max = niceMax(Math.max(0, ...points.map((p) => p.value)));
  const band = (width - GUTTER) / Math.max(points.length, 1);
  const barWidth = Math.min(MAX_BAR, band * 0.6);
  const base = HEIGHT - FOOT;
  const xOf = (i: number) => GUTTER + band * i + band / 2;
  const yOf = (value: number) => base - (value / max) * (base - 8);
  const active = hover === null ? undefined : points[hover];

  return (
    <div ref={setElement} className="relative">
      <ChartTable label={label} points={points} />
      <div aria-hidden>
        {width ? (
          <ChartFrame
            width={width}
            height={HEIGHT}
            max={max}
            points={points}
            xOf={xOf}
            shownLabels={(i) => band > 44 || i % 2 === points.length % 2}
          >
            {points.map((point, i) => (
              <g
                key={point.key}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <rect
                  x={GUTTER + band * i}
                  y={0}
                  width={band}
                  height={base}
                  className="fill-transparent"
                />
                {point.value ? (
                  <path
                    d={columnPath(xOf(i) - barWidth / 2, yOf(point.value), barWidth, base)}
                    className={cn(
                      'fill-primary transition-opacity',
                      hover !== null && hover !== i && 'opacity-50',
                    )}
                  />
                ) : null}
              </g>
            ))}
          </ChartFrame>
        ) : (
          <div style={{ height: HEIGHT }} />
        )}
        {active && hover !== null ? (
          <ChartTooltip x={xOf(hover)} y={yOf(active.value)} text={active.tooltip} />
        ) : null}
      </div>
    </div>
  );
}
