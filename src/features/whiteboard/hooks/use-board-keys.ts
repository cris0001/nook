import { useEffect, useRef } from 'react';

import { isTypingTarget } from '@/utils/typing-target';

import { useWhiteboardStore, type Tool } from '../stores/whiteboard.store';

export const TOOL_KEYS: Record<string, Tool> = {
  v: 'select',
  h: 'hand',
  p: 'pen',
  r: 'rectangle',
  o: 'ellipse',
  a: 'arrow',
  l: 'line',
  t: 'text',
  e: 'eraser',
};

// Returns a getter for "space is held" — the temporary hand, as in most canvas apps.
export function useBoardKeys(editable: boolean): () => boolean {
  const space = useRef(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target) || document.querySelector('[role="dialog"]')) return;
      const s = useWhiteboardStore.getState();
      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      if (event.key === ' ') {
        space.current = true;
        event.preventDefault();
        return;
      }
      if (!editable) return;
      if (mod && key === 'z') {
        event.preventDefault();
        if (event.shiftKey) s.redo();
        else s.undo();
      } else if (mod && key === 'y') {
        event.preventDefault();
        s.redo();
      } else if (mod && key === 'a') {
        event.preventDefault();
        s.setTool('select');
        s.select(s.elements.map((e) => e.id));
      } else if ((event.key === 'Delete' || event.key === 'Backspace') && s.selected.length) {
        event.preventDefault();
        s.commit(
          s.elements,
          s.elements.filter((e) => !s.selected.includes(e.id)),
        );
        s.select([]);
      } else if (event.key === 'Escape') {
        s.select([]);
        s.setTool('select');
      } else if (!mod && !event.altKey && TOOL_KEYS[key]) {
        s.setTool(TOOL_KEYS[key]);
      }
    }
    function onKeyUp(event: KeyboardEvent) {
      if (event.key === ' ') space.current = false;
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [editable]);

  return () => space.current;
}
