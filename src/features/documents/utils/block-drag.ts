import { NodeSelection } from '@tiptap/pm/state';
import type { Editor } from '@tiptap/react';
import type { DragEvent } from 'react';

// Starts dragging the top-level block at `pos` the way ProseMirror does internally:
// select it as a node and mark the view as dragging it with move=true. The editor's
// drop handling then moves the block and shows the drop cursor.
export function startBlockDrag(editor: Editor, pos: number, event: DragEvent): void {
  const { view } = editor;
  const selection = NodeSelection.create(view.state.doc, pos);
  view.dispatch(view.state.tr.setSelection(selection));
  const dom = view.nodeDOM(pos);
  if (dom instanceof HTMLElement) {
    event.dataTransfer.setDragImage(dom, 0, 0);
  }
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', '');
  view.dragging = { slice: selection.content(), move: true };
}
