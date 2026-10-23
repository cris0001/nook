import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useCallback } from 'react';

import type { Page } from '@/schemas/page.schema';

import { movePage } from '../api/pages';
import { useSidebarUiStore } from '../stores/sidebar-ui.store';
import { planDrop, type DropPosition } from '../utils/plan-drop';

// Share of a row's height that counts as its top / bottom edge. Dropping on an edge
// goes before / after the row; anywhere in between nests inside it.
const EDGE = 0.3;

// Drag-and-drop wiring for the page tree. Mouse drags start after a few pixels so a
// click still opens the page; touch drags need a short press so the list can scroll.
// The drop target is read from the dragged row's center against the row under it.
export function usePageDnd(pages: readonly Page[]) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
  );
  const { startDrag, setDropTarget, endDrag, expand } = useSidebarUiStore.getState();

  const onDragStart = useCallback(
    ({ active }: DragStartEvent) => startDrag(String(active.id)),
    [startDrag],
  );

  const onDragMove = useCallback(
    ({ active, over }: DragMoveEvent) => {
      const dragged = active.rect.current.translated;
      if (!over || !dragged || over.id === active.id) {
        setDropTarget(null);
        return;
      }
      const ratio = (dragged.top + dragged.height / 2 - over.rect.top) / over.rect.height;
      const position: DropPosition =
        ratio < EDGE ? 'before' : ratio > 1 - EDGE ? 'after' : 'inside';
      const id = String(over.id);
      const valid = planDrop(pages, String(active.id), id, position) !== null;
      const current = useSidebarUiStore.getState().dropTarget;
      if (!valid) {
        if (current) setDropTarget(null);
      } else if (current?.id !== id || current.position !== position) {
        setDropTarget({ id, position });
      }
    },
    [pages, setDropTarget],
  );

  const onDragEnd = useCallback(
    ({ active }: DragEndEvent) => {
      const target = useSidebarUiStore.getState().dropTarget;
      endDrag();
      if (!target) {
        return;
      }
      const plan = planDrop(pages, String(active.id), target.id, target.position);
      if (plan) {
        if (target.position === 'inside') {
          expand(target.id);
        }
        void movePage(String(active.id), plan.parentId, plan.order);
      }
    },
    [pages, endDrag, expand],
  );

  return { sensors, onDragStart, onDragMove, onDragEnd, onDragCancel: endDrag };
}
