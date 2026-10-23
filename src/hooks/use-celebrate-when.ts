import { useEffect, useRef } from 'react';

import { useBrandMoodStore } from '@/stores/brand-mood.store';

// Fires on the transition into `done`, not on mount — opening an already finished
// database shouldn't celebrate again. `undefined` means still loading.
export function useCelebrateWhen(done: boolean | undefined) {
  const celebrate = useBrandMoodStore((s) => s.celebrate);
  const previous = useRef(done);

  useEffect(() => {
    if (previous.current === false && done === true) {
      celebrate();
    }
    if (done !== undefined) {
      previous.current = done;
    }
  }, [done, celebrate]);
}
