import { useEffect, useRef, type RefObject } from 'react';

import { prefersReducedMotion } from '@/utils/motion';
import { pupilOffset, type Point } from '@/utils/pupil-offset';

// Without pointer movement for this long, the eyes stop following and look around.
const IDLE_AFTER_MS = 2500;
// First glance comes sooner so a freshly mounted logo (and touch devices, which never
// send a hover) shows signs of life right away.
const FIRST_GLANCE_MS = 900;
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

export interface EyeRefs {
  eye: RefObject<HTMLSpanElement | null>;
  pupil: RefObject<HTMLSpanElement | null>;
}

// How far a pupil can travel from center: half the free space inside the eye.
function travelOf(eye: HTMLElement, pupil: HTMLElement): number {
  return Math.max((eye.clientWidth - pupil.offsetWidth) / 2, 0);
}

function centerOf(el: HTMLElement): Point {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// Drives a pair of eyes: pupils follow the pointer, and after a pause they glance
// around on their own. Pupils are moved by writing `translate` straight to the DOM
// inside requestAnimationFrame — pointermove fires far too often to go through
// React state and re-render the logo on every event.
export function useEyeTracking(enabled: boolean): readonly [EyeRefs, EyeRefs] {
  const leftEye = useRef<HTMLSpanElement>(null);
  const leftPupil = useRef<HTMLSpanElement>(null);
  const rightEye = useRef<HTMLSpanElement>(null);
  const rightPupil = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const pairs = [
      { eye: leftEye, pupil: leftPupil },
      { eye: rightEye, pupil: rightPupil },
    ];
    const reducedMotion = prefersReducedMotion();
    let pointer: Point | null = null;
    let frame = 0;
    let glance = 0;
    let idleTimer = 0;
    let glanceTimer = 0;

    function place(offsetFor: (eye: HTMLElement, travel: number) => Point, durationMs: number) {
      for (const { eye, pupil } of pairs) {
        if (!eye.current || !pupil.current) {
          continue;
        }
        const { x, y } = offsetFor(eye.current, travelOf(eye.current, pupil.current));
        pupil.current.style.transitionDuration = `${durationMs}ms`;
        pupil.current.style.translate = `${x}px ${y}px`;
      }
    }

    function follow() {
      frame = 0;
      const target = pointer;
      if (target) {
        place((eye, travel) => pupilOffset(centerOf(eye), target, travel), FOLLOW_MS);
      }
    }

    function lookAround() {
      const next = GLANCES[glance % GLANCES.length] ?? CENTER;
      glance += 1;
      place((_eye, travel) => ({ x: next.x * travel, y: next.y * travel }), GLANCE_MS);
      glanceTimer = window.setTimeout(lookAround, GLANCE_EVERY_MS);
    }

    function goIdle() {
      pointer = null;
      window.clearTimeout(idleTimer);
      window.clearTimeout(glanceTimer);
      if (reducedMotion) {
        place(() => CENTER, GLANCE_MS);
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

  return [
    { eye: leftEye, pupil: leftPupil },
    { eye: rightEye, pupil: rightPupil },
  ];
}
