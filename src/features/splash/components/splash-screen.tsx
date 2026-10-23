import { BrandMark } from '@/components/brand';
import { cn } from '@/lib/utils';

import { SPLASH_LOGO_OUT_MS, SPLASH_REVEAL_MS, useSplash } from '../hooks/use-splash';

// Full-screen white intro with the animated wordmark, shown once per browser session.
// It overlays the app (which keeps loading underneath). On the way out the wordmark
// drifts back and blurs away first, the screen holds empty white for a beat, and only
// then does the white fade to reveal the app.
export function SplashScreen() {
  const { phase, skip } = useSplash();

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      aria-hidden
      onClick={skip}
      style={{ transitionDuration: `${SPLASH_REVEAL_MS}ms` }}
      className={cn(
        'fixed inset-0 z-50 flex cursor-default items-center justify-center bg-white text-neutral-950 transition-opacity ease-out',
        phase !== 'visible' && 'pointer-events-none',
        phase === 'revealing' && 'opacity-0',
      )}
    >
      <div
        style={{ transitionDuration: `${SPLASH_LOGO_OUT_MS}ms` }}
        className={cn(
          'transition-[scale,filter,opacity] ease-in',
          phase !== 'visible' && 'scale-90 opacity-0 blur-md',
        )}
      >
        <BrandMark animated intro className="text-[clamp(4.5rem,18vw,11rem)]" />
      </div>
    </div>
  );
}
