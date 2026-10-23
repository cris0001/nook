import type { Editor } from '@tiptap/react';
import { GripVertical } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useDocumentsTranslation } from '../i18n';
import { startBlockDrag } from '../utils/block-drag';

interface Hovered {
  pos: number;
  top: number;
}

// A grip that appears beside the top-level block under the pointer. Dragging it hands
// the block to ProseMirror's own drag-and-drop (as a node selection with move=true), so
// the drop cursor and the move itself come from the editor — no extra plugin needed.
// Desktop only: touch screens have no hover to reveal it.
export function BlockHandle({
  editor,
  container,
}: {
  editor: Editor;
  container: HTMLElement | null;
}) {
  const t = useDocumentsTranslation();
  const [hovered, setHovered] = useState<Hovered | null>(null);

  useEffect(() => {
    if (!container) {
      return;
    }
    const onMove = (event: MouseEvent) => {
      const { view } = editor;
      const bounds = view.dom.getBoundingClientRect();
      const hit = view.posAtCoords({ left: bounds.left + 24, top: event.clientY });
      if (!hit) {
        return;
      }
      const $pos = view.state.doc.resolve(hit.pos);
      if ($pos.depth < 1) {
        return;
      }
      const pos = $pos.before(1);
      const dom = view.nodeDOM(pos);
      if (dom instanceof HTMLElement) {
        const top = dom.getBoundingClientRect().top - container.getBoundingClientRect().top;
        setHovered((current) =>
          current?.pos === pos && current.top === top ? current : { pos, top },
        );
      }
    };
    const onLeave = () => setHovered(null);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [editor, container]);

  if (!hovered) {
    return null;
  }

  return (
    <button
      type="button"
      draggable
      onDragStart={(event) => hovered && startBlockDrag(editor, hovered.pos, event)}
      onDragEnd={() => setHovered(null)}
      aria-label={t.dragBlock}
      title={t.dragBlock}
      className="text-muted-foreground hover:bg-hover absolute -left-7 hidden h-6 w-5 cursor-grab items-center justify-center rounded lg:flex"
      style={{ top: hovered.top + 1 }}
    >
      <GripVertical className="size-4" />
    </button>
  );
}
