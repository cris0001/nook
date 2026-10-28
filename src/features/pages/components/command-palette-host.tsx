import { lazy, Suspense } from 'react';

import { usePaletteShortcut } from '../hooks/use-palette-shortcut';
import { useCommandPaletteStore } from '../stores/command-palette.store';

const Palette = lazy(() =>
  import('./command-palette').then((m) => ({ default: m.CommandPalette })),
);

// The shortcut is always live; the palette itself (and cmdk) loads on first open.
export function CommandPaletteHost() {
  usePaletteShortcut();
  const open = useCommandPaletteStore((s) => s.open);
  return open ? (
    <Suspense fallback={null}>
      <Palette />
    </Suspense>
  ) : null;
}
