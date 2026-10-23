import { type CSSProperties } from 'react';

import { useBlink } from '@/hooks/use-blink';
import { useEyeTracking } from '@/hooks/use-eye-tracking';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/utils/motion';

import { BrandEye } from './brand-eye';

// Splash entrance, in ms. After a beat of white the whole wordmark fades in in place
// (nothing moves or scales, so nothing jumps), with the eyes still shut as thin slits;
// once it's fully visible they ease open. `backwards` fill keeps everything hidden /
// shut until its delay is up without pinning `scale` afterwards, so blinking still
// works once the intro is over.
const START_MS = 250;
const FADE_IN_MS = 450;
const EYES_OPEN_AT_MS = START_MS + FADE_IN_MS + 150;
const EYE_OPEN_MS = 380;

function eyeOpen(lagMs: number): CSSProperties {
  const delay = EYES_OPEN_AT_MS + lagMs;
  return { animation: `eye-open ${EYE_OPEN_MS}ms var(--ease-out-soft) ${delay}ms backwards` };
}

const INTRO = {
  mark: { animation: `fade-in ${FADE_IN_MS}ms ease-out ${START_MS}ms backwards` },
  leftEye: eyeOpen(0),
  rightEye: eyeOpen(50),
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
  const playIntro = intro && !prefersReducedMotion();

  return (
    <span
      role="img"
      aria-label="nOOk"
      style={playIntro ? INTRO.mark : undefined}
      className={cn(
        'font-heading inline-block leading-none font-extrabold tracking-tight whitespace-nowrap select-none',
        className,
      )}
    >
      <span aria-hidden>n</span>
      <BrandEye eyeRef={left} closed={blinking} style={playIntro ? INTRO.leftEye : undefined} />
      <BrandEye eyeRef={right} closed={blinking} style={playIntro ? INTRO.rightEye : undefined} />
      <span aria-hidden>k</span>
    </span>
  );
}
