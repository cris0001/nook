import { useCallback, useEffect, useState } from 'react';

import { prefersReducedMotion } from '@/utils/motion';

// sessionStorage, not localStorage: the splash greets every new visit (new tab or
// window) but stays out of the way on reloads and navigation within one.
const SPLASH_KEY = 'nook-splash-seen';
const VISIBLE_MS = 3200;
const VISIBLE_REDUCED_MS = 1200;
export const SPLASH_LOGO_OUT_MS = 500;
const HOLD_WHITE_MS = 350;
export const SPLASH_REVEAL_MS = 750;

export type SplashPhase = 'visible' | 'leaving' | 'revealing' | 'done';

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

export function useSplash(ready: boolean) {
  const [phase, setPhase] = useState<SplashPhase>(() => (hasSeenSplash() ? 'done' : 'visible'));

  const skip = useCallback(() => {
    setPhase((current) => (current === 'visible' ? 'leaving' : current));
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      return;
    }

    if (phase === 'leaving') {
      const timer = window.setTimeout(
        () => setPhase('revealing'),
        SPLASH_LOGO_OUT_MS + HOLD_WHITE_MS,
      );
      return () => window.clearTimeout(timer);
    }

    if (phase === 'revealing') {
      const timer = window.setTimeout(() => {
        markSplashSeen();
        setPhase('done');
      }, SPLASH_REVEAL_MS);
      return () => window.clearTimeout(timer);
    }

    window.addEventListener('keydown', skip);
    if (!ready) {
      return () => window.removeEventListener('keydown', skip);
    }

    const timer = window.setTimeout(skip, prefersReducedMotion() ? VISIBLE_REDUCED_MS : VISIBLE_MS);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', skip);
    };
  }, [phase, ready, skip]);

  return { phase, skip };
}
