import { useEffect, useMemo, useRef } from 'react';

import { cn } from '@/lib/utils';

import { useDocumentsTranslation } from '../i18n';
import { useSlashMenuStore } from '../stores/slash-menu.store';
import { matchesQuery, SLASH_ITEMS } from '../utils/slash-items';

const WIDTH = 288;
const MAX_HEIGHT = 320;

// The floating "/" block menu, positioned under the caret (or above it near the bottom
// of the screen). Mouse picks use onMouseDown + preventDefault so the editor keeps
// focus and the "/query" range stays valid.
export function SlashMenu() {
  const t = useDocumentsTranslation();
  const { open, query, rect, index, pick, setIndex, setItems } = useSlashMenuStore();
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo(
    () =>
      SLASH_ITEMS.filter((item) => {
        const [title, description] = t.blocks[item.id];
        return matchesQuery(`${title} ${description} ${item.keywords}`, query);
      }),
    [query, t],
  );

  useEffect(() => {
    setItems(items);
  }, [items, setItems]);

  useEffect(() => {
    listRef.current?.children[index]?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  if (!open || !rect) {
    return null;
  }

  const below = rect.bottom + 6 + MAX_HEIGHT < window.innerHeight;
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - WIDTH - 8));

  return (
    <div
      role="listbox"
      className="bg-background fixed z-50 overflow-hidden rounded-md border p-1 shadow-lg"
      style={{
        left,
        width: WIDTH,
        ...(below ? { top: rect.bottom + 6 } : { bottom: window.innerHeight - rect.top + 6 }),
      }}
    >
      {items.length === 0 ? (
        <p className="text-muted-foreground px-2 py-2 text-sm">{t.noMatches}</p>
      ) : (
        <ul ref={listRef} className="overflow-y-auto" style={{ maxHeight: MAX_HEIGHT }}>
          {items.map((item, i) => {
            const [title, description] = t.blocks[item.id];
            const Icon = item.icon;
            return (
              <li key={item.id} role="option" aria-selected={i === index}>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    pick?.(item);
                  }}
                  onMouseEnter={() => setIndex(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left',
                    i === index && 'bg-hover',
                  )}
                >
                  <span className="bg-background flex size-9 shrink-0 items-center justify-center rounded-md border">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm">{title}</span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
