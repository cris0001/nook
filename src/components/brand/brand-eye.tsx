import { type CSSProperties, type Ref } from 'react';

import { cn } from '@/lib/utils';

// How far the pupil may travel from center, in viewBox units (the eye is 100 wide).
// Sized so the pupil just kisses the inner edge of the ring at full look.
const PUPIL_TRAVEL = 13;

// One "O" of the nOOk wordmark drawn as an eye: white sclera, a ring the weight of the
// letters, and a pupil with a catchlight. useEyeTracking only writes --look-x/--look-y
// (-1…1) onto the svg, and the pupil turns them into a `translate` in viewBox units, so
// the same values work at any rendered size. Blinking squashes the whole svg via
// `scale` — a separate property, so blinking and looking never fight.
export function BrandEye({
  eyeRef,
  closed,
  style,
}: {
  eyeRef: Ref<SVGSVGElement>;
  closed: boolean;
  style?: CSSProperties | undefined;
}) {
  return (
    <svg
      ref={eyeRef}
      viewBox="0 0 100 100"
      aria-hidden
      style={style}
      className={cn(
        'mx-[0.01em] inline-block size-[0.66em] overflow-visible transition-[scale] duration-100',
        closed && 'scale-y-[0.08]',
      )}
    >
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="var(--brand-eye-white)"
        stroke="currentColor"
        strokeWidth="18"
      />
      <g
        style={{
          translate: `calc(var(--look-x, 0) * ${PUPIL_TRAVEL}px) calc(var(--look-y, 0) * ${PUPIL_TRAVEL}px)`,
          transition: 'translate var(--look-ms, 0ms) ease-out',
        }}
      >
        <circle cx="50" cy="50" r="18" fill="currentColor" />
        <circle cx="43" cy="43" r="5.5" fill="var(--brand-eye-white)" />
      </g>
    </svg>
  );
}
