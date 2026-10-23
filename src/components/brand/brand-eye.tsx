import { useId, type Ref } from 'react';

import { cn } from '@/lib/utils';

export type EyeSide = 'left' | 'right';
export type EyeMood = 'open' | 'asleep' | 'happy';

const OUTLINES: Record<EyeSide, string> = {
  left: 'M53 1 C80 4 99 25 97 53 C95 80 74 100 47 98 C20 96 2 76 4 48 C6 21 26 -2 53 1Z',
  right: 'M48 2 C76 0 98 21 98 49 C98 78 79 98 51 99 C23 100 3 80 2 52 C1 24 21 4 48 2Z',
};

const SCLERA = 'translate(50 50) scale(0.68) translate(-50 -50)';

const IRIS_TRAVEL = 14;

// One "O" of the nOOk wordmark drawn as an eye: a hand-drawn ring around the white,
// a brand-colored iris, a black pupil and two catchlights. useEyeTracking only writes
// --look-x/--look-y (-1…1) onto the svg, and the iris group turns them into a
// `translate` in viewBox units, so the same values work at any rendered size. Blinking
// squashes the whole svg via `scale` — a separate property, so blinking and looking
// never fight. Token colors go through classes, not fill="var(…)": not every browser
// resolves var() in SVG presentation attributes, and an unresolved fill falls back to
// solid black.
export function BrandEye({
  side,
  eyeRef,
  closed,
  mood = 'open',
}: {
  side: EyeSide;
  eyeRef?: Ref<SVGSVGElement>;
  closed: boolean;
  mood?: EyeMood;
}) {
  // Gradient and clip ids must be unique per eye — two eyes (or two logos) share a page.
  const id = useId();
  const irisId = `${id}-iris`;
  const scleraId = `${id}-sclera`;
  const outline = OUTLINES[side];

  return (
    <svg
      ref={eyeRef}
      viewBox="0 0 100 100"
      aria-hidden
      className={cn(
        'mx-[0.01em] inline-block size-[0.6em] overflow-visible transition-[scale] duration-100',
        closed && mood === 'open' && 'scale-y-[0.08]',
      )}
    >
      <defs>
        <radialGradient id={irisId}>
          <stop offset="30%" className="[stop-color:var(--brand-iris-inner)]" />
          <stop offset="100%" className="[stop-color:var(--brand-iris-outer)]" />
        </radialGradient>
        <clipPath id={scleraId}>
          <path d={outline} transform={SCLERA} />
        </clipPath>
      </defs>
      <path d={outline} fill="currentColor" />
      <path d={outline} transform={SCLERA} className="fill-(--brand-eye-white)" />
      {mood === 'asleep' ? (
        <g className="stroke-black" fill="none" strokeLinecap="round">
          <path d="M28 52 Q50 68 72 52" strokeWidth="6.5" />
          <path d="M35 60 l-4 7 M50 64 v8 M65 60 l4 7" strokeWidth="4" />
        </g>
      ) : mood === 'happy' ? (
        <path
          d="M28 60 Q50 30 72 60"
          className="stroke-black"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
        />
      ) : (
        <g clipPath={`url(#${scleraId})`}>
          <g
            style={{
              translate: `calc(var(--look-x, 0) * ${IRIS_TRAVEL}px) calc(var(--look-y, 0) * ${IRIS_TRAVEL}px)`,
              transition: 'translate var(--look-ms, 0ms) ease-out',
            }}
          >
            <circle cx="50" cy="50" r="17" fill={`url(#${irisId})`} />
            <circle cx="50" cy="50" r="8" fill="#000" />
            <circle cx="44.5" cy="43.5" r="4" className="fill-(--brand-eye-white)" />
            <circle cx="55.5" cy="56" r="1.6" className="fill-(--brand-eye-white)" />
          </g>
        </g>
      )}
    </svg>
  );
}
