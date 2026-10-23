import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import { moveRecord } from '@/lib/data/databases';
import type { PropertyDef, View } from '@/schemas/database.schema';

import { useBoardUiStore } from '../stores/board-ui.store';
import { NO_GROUP, orderForDrop, type BoardColumn, type CardTarget } from '../utils/board';

export type BoardDropData =
  { kind: 'card'; columnKey: string; recordId: string } | { kind: 'column'; columnKey: string };

// Drag-and-drop for the board. The target is a column + the card to go in front of,
// worked out from the dragged card's center against the card under it. In a sorted
// view only the column changes — manual order would be overridden by the sort anyway.
export function useBoardDnd(columns: BoardColumn[], view: View, group: PropertyDef) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
  );
  const { startDrag, setTarget, endDrag } = useBoardUiStore.getState();

  function targetFor(event: DragMoveEvent): CardTarget | null {
    const data = event.over?.data.current as BoardDropData | undefined;
    const dragged = event.active.rect.current.translated;
    if (!data || !event.over || !dragged) {
      return null;
    }
    if (data.kind === 'column') {
      return { columnKey: data.columnKey, beforeId: null };
    }
    if (data.recordId === event.active.id) {
      return null;
    }
    const below =
      dragged.top + dragged.height / 2 > event.over.rect.top + event.over.rect.height / 2;
    if (!below) {
      return { columnKey: data.columnKey, beforeId: data.recordId };
    }
    const cards = columns
      .find((c) => c.key === data.columnKey)
      ?.records.filter((r) => r.id !== event.active.id);
    const index = cards?.findIndex((r) => r.id === data.recordId) ?? -1;
    return { columnKey: data.columnKey, beforeId: cards?.[index + 1]?.id ?? null };
  }

  return {
    sensors,
    onDragStart: ({ active }: DragStartEvent) => startDrag(String(active.id)),
    onDragMove: (event: DragMoveEvent) => {
      const next = targetFor(event);
      const current = useBoardUiStore.getState().target;
      if (next?.columnKey !== current?.columnKey || next?.beforeId !== current?.beforeId) {
        setTarget(next);
      }
    },
    onDragEnd: ({ active }: DragEndEvent) => {
      const target = useBoardUiStore.getState().target;
      endDrag();
      const column = target ? columns.find((c) => c.key === target.columnKey) : undefined;
      if (!target || !column) {
        return;
      }
      const id = String(active.id);
      const order = view.sorts.length ? null : orderForDrop(column, target, id);
      void moveRecord(id, group.id, column.key === NO_GROUP ? null : column.key, order);
    },
    onDragCancel: endDrag,
  };
}
