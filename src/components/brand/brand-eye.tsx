import { useId, type Ref } from 'react';

import { cn } from '@/lib/utils';

// How far the iris may travel from center, in viewBox units (the eye is 100 wide).
// Sized so the iris just kisses the inner edge of the ring at full look.
const IRIS_TRAVEL = 11;

// One "O" of the nOOk wordmark drawn as an eye: white sclera inside a ring the weight
// of the letters, a brand-colored iris, a black pupil and two catchlights.
// useEyeTracking only writes --look-x/--look-y (-1…1) onto the svg, and the iris group
// turns them into a `translate` in viewBox units, so the same values work at any
// rendered size. Blinking squashes the whole svg via `scale` — a separate property,
// so blinking and looking never fight. Token colors go through classes, not
// fill="var(…)": not every browser resolves var() in SVG presentation attributes,
// and an unresolved fill falls back to solid black.
export function BrandEye({ eyeRef, closed }: { eyeRef: Ref<SVGSVGElement>; closed: boolean }) {
  // Gradient and clip ids must be unique per eye — two eyes (or two logos) share a page.
  const id = useId();
  const irisId = `${id}-iris`;
  const scleraId = `${id}-sclera`;

  return (
    <svg
      ref={eyeRef}
      viewBox="0 0 100 100"
      aria-hidden
      className={cn(
        'mx-[0.01em] inline-block size-[0.6em] overflow-visible transition-[scale] duration-100',
        closed && 'scale-y-[0.08]',
      )}
    >
      <defs>
        <radialGradient id={irisId}>
          <stop offset="30%" className="[stop-color:var(--brand-iris-inner)]" />
          <stop offset="100%" className="[stop-color:var(--brand-iris-outer)]" />
        </radialGradient>
        {/* Keeps the iris inside the white when it looks all the way to one side. */}
        <clipPath id={scleraId}>
          <circle cx="50" cy="50" r="32" />
        </clipPath>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="41"
        className="fill-(--brand-eye-white)"
        stroke="currentColor"
        strokeWidth="18"
      />
      <g clipPath={`url(#${scleraId})`}>
        <g
          style={{
            translate: `calc(var(--look-x, 0) * ${IRIS_TRAVEL}px) calc(var(--look-y, 0) * ${IRIS_TRAVEL}px)`,
            transition: 'translate var(--look-ms, 0ms) ease-out',
          }}
        >
          <circle cx="50" cy="50" r="21" fill={`url(#${irisId})`} />
          <circle cx="50" cy="50" r="10" fill="#000" />
          <circle cx="43" cy="42" r="5" className="fill-(--brand-eye-white)" />
          <circle cx="57" cy="57" r="2" className="fill-(--brand-eye-white)" />
        </g>
      </g>
    </svg>
  );
}
