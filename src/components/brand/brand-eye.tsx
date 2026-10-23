import { type CSSProperties, type Ref } from 'react';

import { cn } from '@/lib/utils';

// One "O" of the nOOk wordmark: a ring the weight of the letters with a pupil inside.
// Sized in em so it scales with the surrounding font size. Blinking squashes the eye
// via `scale`, while the pupil is moved via `translate` by useEyeTracking — separate
// properties, so blinking and looking never fight over one transform.
export function BrandEye({
  eyeRef,
  pupilRef,
  closed,
  style,
}: {
  eyeRef: Ref<HTMLSpanElement>;
  pupilRef: Ref<HTMLSpanElement>;
  closed: boolean;
  style?: CSSProperties | undefined;
}) {
  return (
    <span
      ref={eyeRef}
      aria-hidden
      style={style}
      className={cn(
        'relative mx-[0.015em] inline-block size-[0.58em] rounded-full border-[length:0.1em] border-current transition-[scale] duration-100',
        closed && 'scale-y-[0.08]',
      )}
    >
      <span
        ref={pupilRef}
        className="absolute inset-0 m-auto size-[0.2em] rounded-full bg-current transition-[translate] ease-out"
      />
    </span>
  );
}
