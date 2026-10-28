import { useEffect, useState } from 'react';

import { getScene, saveScene } from '@/lib/data/scenes';
import { debounce } from '@/utils/debounce';

import { useWhiteboardStore } from '../stores/whiteboard.store';

const SAVE_DELAY_MS = 400;

// Loads the scene once, then the board owns it (like the document editor): every change
// in the store is saved after a short pause, and flushed when leaving the page.
export function useSceneSync(pageId: string): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const save = debounce(
      (elements: Parameters<typeof saveScene>[1]) => void saveScene(pageId, elements),
      SAVE_DELAY_MS,
    );
    let unsubscribe: (() => void) | undefined;
    void getScene(pageId).then((elements) => {
      if (!active) return;
      useWhiteboardStore.getState().load(elements);
      setReady(true);
      unsubscribe = useWhiteboardStore.subscribe((state, previous) => {
        if (state.elements !== previous.elements && !state.editingTextId) save(state.elements);
      });
    });
    const flush = () => save.flush();
    window.addEventListener('pagehide', flush);
    return () => {
      active = false;
      unsubscribe?.();
      window.removeEventListener('pagehide', flush);
      flush();
      setReady(false);
    };
  }, [pageId]);

  return ready;
}
