import { useEffect, useState } from 'react';

const WORDMARK_FONT = '800 1em "Bricolage Grotesque Variable"';
// A failed or slow font load must not hold the splash hostage.
const FONT_TIMEOUT_MS = 1500;

// True once the wordmark's display font is loaded. Fontsource uses font-display: swap,
// so painting earlier would show the fallback face first and then visibly jump when
// the real one swaps in.
export function useWordmarkFont(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) {
        setReady(true);
      }
    };

    const timer = window.setTimeout(done, FONT_TIMEOUT_MS);
    void document.fonts.load(WORDMARK_FONT).then(done, done);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return ready;
}
