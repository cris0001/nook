import { useState, type PointerEvent } from 'react';

import { useWidth } from '../hooks/use-width';
import { niceMax } from '../utils/scale';
import { ChartFrame, FOOT, GUTTER, type Point } from './chart-frame';
import { ChartTable } from './chart-table';
import { ChartTooltip } from './chart-tooltip';

const HEIGHT = 200;
const PAD = 10;

export function LineChart({ points, label }: { points: Point[]; label: string }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const width = useWidth(element);
  const max = niceMax(Math.max(0, ...points.map((p) => p.value)));
  const base = HEIGHT - FOOT;
  const step = (width - GUTTER - PAD * 2) / Math.max(points.length - 1, 1);
  const xOf = (i: number) => GUTTER + PAD + step * i;
  const yOf = (value: number) => base - (value / max) * (base - 8);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${xOf(i)},${yOf(p.value)}`).join('');
  const area = `${line}L${xOf(points.length - 1)},${base}L${xOf(0)},${base}Z`;
  const last = points.length - 1;
  const shown = hover ?? last;
  const active = points[shown];

  function onMove(event: PointerEvent<SVGRectElement>) {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().left;
    setHover(Math.max(0, Math.min(last, Math.round((x - PAD) / step))));
  }

  return (
    <div ref={setElement} className="relative">
      <ChartTable label={label} points={points} />
      <div aria-hidden>
        {width && points.length ? (
          <ChartFrame
            width={width}
            height={HEIGHT}
            max={max}
            points={points}
            xOf={xOf}
            shownLabels={(i) => i === 0 || i === last || i === Math.floor(last / 2)}
          >
            <path d={area} className="fill-primary/10" />
            <path
              d={line}
              fill="none"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="stroke-primary"
            />
            {hover !== null ? (
              <line
                x1={xOf(hover)}
                x2={xOf(hover)}
                y1={0}
                y2={base}
                strokeWidth={1}
                className="stroke-border"
              />
            ) : null}
            {active ? (
              <circle
                cx={xOf(shown)}
                cy={yOf(active.value)}
                r={4.5}
                strokeWidth={2}
                className="fill-primary stroke-background"
              />
            ) : null}
            <rect
              x={GUTTER}
              y={0}
              width={width - GUTTER}
              height={base}
              className="fill-transparent"
              onPointerMove={onMove}
              onPointerLeave={() => setHover(null)}
            />
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
