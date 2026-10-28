import type { ReactNode } from 'react';

const WIDTH = 288;
export const SUGGESTION_MAX_HEIGHT = 320;

// Floats under the caret, or above it near the bottom of the screen.
export function SuggestionPopup({
  rect,
  label,
  children,
  width = WIDTH,
}: {
  rect: DOMRect;
  label: string;
  children: ReactNode;
  width?: number;
}) {
  const below = rect.bottom + 6 + SUGGESTION_MAX_HEIGHT < window.innerHeight;
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));

  return (
    <div
      role="listbox"
      aria-label={label}
      className="bg-background fixed z-50 overflow-hidden rounded-md border p-1 shadow-lg"
      style={{
        left,
        width,
        ...(below ? { top: rect.bottom + 6 } : { bottom: window.innerHeight - rect.top + 6 }),
      }}
    >
      {children}
    </div>
  );
}
