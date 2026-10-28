import { useEffect } from 'react';

import { useCommandPaletteStore } from '../stores/command-palette.store';

// Listens on window in the bubble phase: the editor claims ⌘K first (as "link" when
// text is selected) and marks the event handled, so the palette leaves it alone.
export function usePaletteShortcut() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.key.toLowerCase() !== 'k') return;
      if (!(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      const { open, setOpen } = useCommandPaletteStore.getState();
      setOpen(!open);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
