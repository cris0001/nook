import { type CSSProperties } from 'react';

import { useBlink } from '@/hooks/use-blink';
import { useEyeTracking } from '@/hooks/use-eye-tracking';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/utils/motion';

import { BrandEye } from './brand-eye';

// Splash entrance, in ms. Letters pop in one by one (blurred, small, from below, with
// a springy overshoot); the eyes arrive shut as thin slits and open once the word has
// landed. `backwards` fill hides each piece until its delay is up without pinning
// `scale` afterwards, so blinking still works once the intro is over.
const LETTER_IN_MS = 760;
const EYE_OPEN_MS = 460;
const START_MS = 250;
const STAGGER_MS = 110;
const EYES_OPEN_AT_MS = 1250;

function letterIn(index: number): CSSProperties {
  const delay = START_MS + index * STAGGER_MS;
  return { animation: `letter-in ${LETTER_IN_MS}ms var(--ease-spring) ${delay}ms backwards` };
}

// While both run, eye-open (listed last) owns `scale`, so the eye rises in as a slit.
function eyeIn(index: number, eye: number): CSSProperties {
  const letter = letterIn(index).animation ?? '';
  const delay = EYES_OPEN_AT_MS + eye * 60;
  return { animation: `${letter}, eye-open ${EYE_OPEN_MS}ms var(--ease-pop) ${delay}ms backwards` };
}

const INTRO = {
  n: letterIn(0),
  leftEye: eyeIn(1, 0),
  rightEye: eyeIn(2, 1),
  k: letterIn(3),
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
      className={cn(
        'font-heading inline-block leading-none font-extrabold tracking-tight whitespace-nowrap select-none',
        className,
      )}
    >
      <span aria-hidden className="inline-block" style={playIntro ? INTRO.n : undefined}>
        n
      </span>
      <BrandEye eyeRef={left} closed={blinking} style={playIntro ? INTRO.leftEye : undefined} />
      <BrandEye eyeRef={right} closed={blinking} style={playIntro ? INTRO.rightEye : undefined} />
      <span aria-hidden className="inline-block" style={playIntro ? INTRO.k : undefined}>
        k
      </span>
    </span>
  );
}
