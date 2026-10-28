import type { Announcements, ScreenReaderInstructions, UniqueIdentifier } from '@dnd-kit/core';

import { useCommonTranslation } from '@/lib/i18n/common';

// dnd-kit's default announcements read raw ids ("Draggable item 0cdb… was dropped over
// droppable area c87d…") in English. These use the item names, in the UI language.
export function useDndAccessibility(nameOf: (id: UniqueIdentifier) => string): {
  announcements: Announcements;
  screenReaderInstructions: ScreenReaderInstructions;
} {
  const t = useCommonTranslation();
  const name = (id: UniqueIdentifier) => nameOf(id) || t.untitled;
  return {
    screenReaderInstructions: { draggable: t.dnd.instructions },
    announcements: {
      onDragStart: ({ active }) => t.dnd.picked(name(active.id)),
      onDragOver: ({ active, over }) =>
        over ? t.dnd.over(name(active.id), name(over.id)) : t.dnd.away(name(active.id)),
      onDragEnd: ({ active, over }) =>
        over
          ? t.dnd.dropped(name(active.id), name(over.id))
          : t.dnd.droppedNowhere(name(active.id)),
      onDragCancel: ({ active }) => t.dnd.cancelled(name(active.id)),
    },
  };
}
