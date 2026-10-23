import { BrandMark } from '@/components/brand';
import { cn } from '@/lib/utils';

import { SPLASH_LOGO_OUT_MS, SPLASH_REVEAL_MS, useSplash } from '../hooks/use-splash';
import { useWordmarkFont } from '../hooks/use-wordmark-font';

export function SplashScreen() {
  const fontReady = useWordmarkFont();
  const { phase, skip } = useSplash(fontReady);

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      aria-hidden
      onClick={skip}
      style={{ transitionDuration: `${SPLASH_REVEAL_MS}ms` }}
      className={cn(
        'fixed inset-0 z-50 flex cursor-default items-center justify-center bg-background text-foreground transition-opacity ease-out',
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
        {fontReady ? <BrandMark animated intro className="text-[clamp(3.5rem,14vw,8rem)]" /> : null}
      </div>
    </div>
  );
}
