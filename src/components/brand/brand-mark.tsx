import { type CSSProperties } from 'react';

import { useBlink } from '@/hooks/use-blink';
import { useEyeTracking } from '@/hooks/use-eye-tracking';
import { cn } from '@/lib/utils';
import { useBrandMoodStore } from '@/stores/brand-mood.store';
import { prefersReducedMotion } from '@/utils/motion';

import { BrandEye, type EyeMood } from './brand-eye';

// Splash entrance: after a short beat of white the whole wordmark, eyes open, fades
// from 0 to full opacity in place — nothing moves or scales, so nothing jumps.
// `backwards` fill keeps it hidden until the delay is up.
const START_MS = 300;
const FADE_IN_MS = 450;
const INTRO: CSSProperties = {
  animation: `fade-in ${FADE_IN_MS}ms ease-out ${START_MS}ms backwards`,
};

// The nOOk wordmark, where the double O is a pair of eyes. `animated` turns on cursor
// tracking, idle glances and blinking; `intro` plays the splash entrance. Font size
// comes from the parent (or className) — everything inside is sized in em. The optical
// size is pinned to Bricolage's display end (opsz 96) so the letters keep the same
// shapes at any size instead of the font redrawing them for small text.
export function BrandMark({
  className,
  animated = false,
  intro = false,
  mood = 'open',
  eyesOnly = false,
}: {
  className?: string;
  animated?: boolean;
  intro?: boolean;
  mood?: EyeMood;
  eyesOnly?: boolean;
}) {
  const happy = useBrandMoodStore((s) => s.happy);
  const shown: EyeMood = animated && happy ? 'happy' : mood;
  const [left, right] = useEyeTracking(animated && shown === 'open');
  const blinking = useBlink(animated && shown === 'open');
  const playIntro = intro && !prefersReducedMotion();

  return (
    <span
      role="img"
      aria-label="nOOk"
      style={playIntro ? INTRO : undefined}
      className={cn(
        "font-heading inline-block leading-none [font-variation-settings:'opsz'_96] font-extrabold tracking-tight whitespace-nowrap select-none",
        className,
      )}
    >
      {eyesOnly ? null : <span aria-hidden>n</span>}
      <BrandEye side="left" eyeRef={left} closed={blinking} mood={shown} />
      <BrandEye side="right" eyeRef={right} closed={blinking} mood={shown} />
      {eyesOnly ? null : <span aria-hidden>k</span>}
    </span>
  );
}
