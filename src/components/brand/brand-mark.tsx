import { type CSSProperties } from 'react';

import { useBlink } from '@/hooks/use-blink';
import { useEyeTracking } from '@/hooks/use-eye-tracking';
import { cn } from '@/lib/utils';

import { BrandEye } from './brand-eye';

// Staggered entrance for the splash: letters rise in one after another, then the eyes
// open. `backwards` fill keeps each piece hidden until its delay is up without
// pinning `scale` afterwards, so blinking still works once the intro is over.
const INTRO = {
  n: { animation: 'rise-in 520ms var(--ease-out-soft) 0ms backwards' },
  leftEye: {
    animation:
      'rise-in 520ms var(--ease-out-soft) 90ms backwards, eye-open 360ms var(--ease-pop) 620ms backwards',
  },
  rightEye: {
    animation:
      'rise-in 520ms var(--ease-out-soft) 180ms backwards, eye-open 360ms var(--ease-pop) 660ms backwards',
  },
  k: { animation: 'rise-in 520ms var(--ease-out-soft) 270ms backwards' },
} satisfies Record<string, CSSProperties>;

// The nOOk wordmark, where the double O is a pair of eyes. `animated` turns on cursor
// tracking, idle glances and blinking; `intro` plays the splash entrance. Font size
// comes from the parent (or className) — everything inside is sized in em.
export function BrandMark({
  className,
  animated = false,
  intro = false,
}: {
  className?: string;
  animated?: boolean;
  intro?: boolean;
}) {
  const [left, right] = useEyeTracking(animated);
  const blinking = useBlink(animated);

  return (
    <span
      role="img"
      aria-label="nOOk"
      className={cn(
        'inline-block leading-none font-extrabold tracking-tight whitespace-nowrap select-none',
        className,
      )}
    >
      <span aria-hidden className="inline-block" style={intro ? INTRO.n : undefined}>
        n
      </span>
      <BrandEye
        eyeRef={left.eye}
        pupilRef={left.pupil}
        closed={blinking}
        style={intro ? INTRO.leftEye : undefined}
      />
      <BrandEye
        eyeRef={right.eye}
        pupilRef={right.pupil}
        closed={blinking}
        style={intro ? INTRO.rightEye : undefined}
      />
      <span aria-hidden className="inline-block" style={intro ? INTRO.k : undefined}>
        k
      </span>
    </span>
  );
}
