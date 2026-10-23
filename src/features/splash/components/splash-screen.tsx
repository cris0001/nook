import { BrandMark } from '@/components/brand';
import { cn } from '@/lib/utils';

import { SPLASH_FADE_MS, useSplash } from '../hooks/use-splash';

// Full-screen white intro with the animated wordmark, shown once per browser session.
// It overlays the app (which keeps loading underneath) and fades out on its own or
// on click / key press.
export function SplashScreen() {
  const { phase, skip } = useSplash();

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      aria-hidden
      onClick={skip}
      style={{ transitionDuration: `${SPLASH_FADE_MS}ms` }}
      className={cn(
        'fixed inset-0 z-50 flex cursor-default items-center justify-center bg-white text-neutral-950 transition-opacity',
        phase === 'leaving' && 'pointer-events-none opacity-0',
      )}
    >
      <BrandMark animated intro className="text-[clamp(4.5rem,18vw,11rem)]" />
    </div>
  );
}
