import { useEffect, useRef, type RefObject } from 'react';

import { prefersReducedMotion } from '@/utils/motion';
import { pupilOffset, type Point } from '@/utils/pupil-offset';

// Without pointer movement for this long, the eyes stop following and look around.
const IDLE_AFTER_MS = 2500;
// First glance lands just after the splash intro opens the eyes, so a freshly mounted
// logo (and touch devices, which never send a hover) shows signs of life early.
const FIRST_GLANCE_MS = 1600;
const GLANCE_EVERY_MS = 1400;
const FOLLOW_MS = 90;
const GLANCE_MS = 320;

// Idle glance targets as fractions of the pupil's travel; {0, 0} looks straight ahead.
const GLANCES: readonly Point[] = [
  { x: -1, y: 0 },
  { x: 1, y: -0.3 },
  { x: 0, y: 0 },
  { x: 0.5, y: 0.85 },
  { x: -0.7, y: -0.7 },
  { x: 0, y: 0 },
];
const CENTER: Point = { x: 0, y: 0 };

export type EyeRef = RefObject<SVGSVGElement | null>;

// The cursor pulls the pupil fully to the rim only from a few eye-widths away, so a
// big splash logo and a small sidebar logo feel equally lively.
function reachOf(rect: DOMRect): number {
  return Math.max(rect.width * 3, 80);
}

// Drives a pair of eyes: pupils follow the pointer, and after a pause they glance
// around on their own. The look direction is written as CSS variables straight to
// the DOM inside requestAnimationFrame — pointermove fires far too often to go
// through React state and re-render the logo on every event.
export function useEyeTracking(enabled: boolean): readonly [EyeRef, EyeRef] {
  const leftEye = useRef<SVGSVGElement>(null);
  const rightEye = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const eyes = [leftEye, rightEye];
    const reducedMotion = prefersReducedMotion();
    let pointer: Point | null = null;
    let frame = 0;
    let glance = 0;
    let idleTimer = 0;
    let glanceTimer = 0;

    function look(lookFor: (eye: SVGSVGElement) => Point, durationMs: number) {
      for (const { current: eye } of eyes) {
        if (!eye) {
          continue;
        }
        const { x, y } = lookFor(eye);
        eye.style.setProperty('--look-x', x.toFixed(3));
        eye.style.setProperty('--look-y', y.toFixed(3));
        eye.style.setProperty('--look-ms', `${durationMs}ms`);
      }
    }

    function follow() {
      frame = 0;
      const target = pointer;
      if (!target) {
        return;
      }
      look((eye) => {
        const rect = eye.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        return pupilOffset(center, target, 1, reachOf(rect));
      }, FOLLOW_MS);
    }

    function lookAround() {
      const next = GLANCES[glance % GLANCES.length] ?? CENTER;
      glance += 1;
      look(() => next, GLANCE_MS);
      glanceTimer = window.setTimeout(lookAround, GLANCE_EVERY_MS);
    }

    function goIdle() {
      pointer = null;
      window.clearTimeout(idleTimer);
      window.clearTimeout(glanceTimer);
      if (reducedMotion) {
        look(() => CENTER, GLANCE_MS);
      } else {
        lookAround();
      }
    }

    function onPointerMove(event: PointerEvent) {
      pointer = { x: event.clientX, y: event.clientY };
      window.clearTimeout(glanceTimer);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(goIdle, IDLE_AFTER_MS);
      if (!frame) {
        frame = requestAnimationFrame(follow);
      }
    }

    const root = document.documentElement;
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', goIdle);
    idleTimer = window.setTimeout(goIdle, FIRST_GLANCE_MS);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', goIdle);
      window.clearTimeout(idleTimer);
      window.clearTimeout(glanceTimer);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return [leftEye, rightEye];
}
