import { useEffect, useState } from 'react';

import { prefersReducedMotion } from '@/utils/motion';

const BLINK_MS = 130;
const MIN_GAP_MS = 2200;
const MAX_GAP_MS = 5600;
// Chance that a blink is immediately followed by a second one — a single fixed
// rhythm reads as mechanical.
const DOUBLE_BLINK_CHANCE = 0.2;

function randomGap(): number {
  return MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
}

// Returns `true` while the eyes should be shut. Blinks at random intervals so both
// eyes of the logo close together; stays open when disabled or with reduced motion.
export function useBlink(enabled: boolean): boolean {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      return;
    }

    let timer = 0;
    const blink = (gap: number) => {
      timer = window.setTimeout(() => {
        setClosed(true);
        timer = window.setTimeout(() => {
          setClosed(false);
          blink(Math.random() < DOUBLE_BLINK_CHANCE ? BLINK_MS * 1.5 : randomGap());
        }, BLINK_MS);
      }, gap);
    };

    blink(randomGap());
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return closed;
}
