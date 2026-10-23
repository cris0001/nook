import { useCallback, useEffect, useState } from 'react';

import { prefersReducedMotion } from '@/utils/motion';

// sessionStorage, not localStorage: the splash greets every new visit (new tab or
// window) but stays out of the way on reloads and navigation within one.
const SPLASH_KEY = 'nook-splash-seen';
const VISIBLE_MS = 2800;
const VISIBLE_REDUCED_MS = 1200;
export const SPLASH_FADE_MS = 450;

export type SplashPhase = 'visible' | 'leaving' | 'done';

function hasSeenSplash(): boolean {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === '1';
  } catch {
    return false;
  }
}

function markSplashSeen(): void {
  try {
    sessionStorage.setItem(SPLASH_KEY, '1');
  } catch {
    // Storage blocked (private mode) — the splash simply shows again next load.
  }
}

// Splash lifecycle: visible → leaving (fade out) → done (unmounted). Leaves on its
// own after a beat, or straight away on click / any key via `skip`.
export function useSplash() {
  const [phase, setPhase] = useState<SplashPhase>(() => (hasSeenSplash() ? 'done' : 'visible'));

  const skip = useCallback(() => {
    setPhase((current) => (current === 'visible' ? 'leaving' : current));
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      return;
    }

    if (phase === 'leaving') {
      const timer = window.setTimeout(() => {
        markSplashSeen();
        setPhase('done');
      }, SPLASH_FADE_MS);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(skip, prefersReducedMotion() ? VISIBLE_REDUCED_MS : VISIBLE_MS);
    window.addEventListener('keydown', skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', skip);
    };
  }, [phase, skip]);

  return { phase, skip };
}
