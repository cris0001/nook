import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import type { BoardElement } from '@/schemas/scene.schema';

import { useWhiteboardStore } from '../stores/whiteboard.store';
import { INK_TEXT } from '../utils/ink';

// A textarea laid exactly over the text element (in screen space) while it's edited.
// Empty text is removed on blur; otherwise the edit is one undo step.
export function TextEditor({ element }: { element: Extract<BoardElement, { type: 'text' }> }) {
  const camera = useWhiteboardStore((s) => s.camera);
  // A brand-new text undoes to "no text at all", an edit to the previous wording.
  const before = useRef(
    element.text
      ? useWhiteboardStore.getState().elements
      : useWhiteboardStore.getState().elements.filter((e) => e.id !== element.id),
  );
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => area.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  function update(text: string) {
    const { elements, preview } = useWhiteboardStore.getState();
    preview(elements.map((e) => (e.id === element.id ? { ...element, text } : e)));
  }

  function finish() {
    const { elements, preview, commit, setEditingText } = useWhiteboardStore.getState();
    setEditingText(null);
    const current = elements.find((e) => e.id === element.id);
    if (current?.type === 'text' && current.text.trim()) {
      commit(before.current);
    } else {
      preview(elements.filter((e) => e.id !== element.id));
    }
  }

  const size = element.fontSize * camera.zoom;
  return (
    <textarea
      ref={area}
      defaultValue={element.text}
      onChange={(event) => update(event.target.value)}
      onBlur={finish}
      onKeyDown={(event) => {
        if (event.key === 'Escape') event.currentTarget.blur();
      }}
      rows={Math.max(1, element.text.split('\n').length)}
      spellCheck={false}
      className={cn(
        'absolute resize-none overflow-hidden bg-transparent font-medium leading-[1.25] whitespace-pre outline-none',
        INK_TEXT[element.stroke],
      )}
      style={{
        left: element.x * camera.zoom + camera.x,
        top: element.y * camera.zoom + camera.y,
        fontSize: size,
        minWidth: size * 4,
        width: `${Math.max(4, ...element.text.split('\n').map((l) => l.length + 2)) * 0.6}em`,
      }}
    />
  );
}
