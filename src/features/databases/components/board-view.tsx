import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';

import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useBoardDnd } from '../hooks/use-board-dnd';
import { useDatabasesTranslation } from '../i18n';
import { useBoardUiStore } from '../stores/board-ui.store';
import { groupRecords } from '../utils/board';
import { BoardColumn } from './board-column';
import { CardBody } from './card-body';

// Kanban view: records grouped into columns by a select property (the view's choice,
// else the first select). On wider screens the columns share the available width and
// only scroll sideways when there are too many to fit; on phones each column takes
// most of the screen and they swipe with snapping.
export function BoardView({
  database,
  view,
  records,
}: {
  database: Database;
  view: View;
  records: Page[];
}) {
  const t = useDatabasesTranslation();
  const group =
    database.properties.find((p) => p.id === view.groupBy && p.type === 'select') ??
    database.properties.find((p) => p.type === 'select');

  if (!group) {
    return <p className="text-muted-foreground py-10 text-center text-sm">{t.noGroupProperty}</p>;
  }
  return <Board database={database} view={view} records={records} group={group} />;
}

function Board({
  database,
  view,
  records,
  group,
}: {
  database: Database;
  view: View;
  records: Page[];
  group: NonNullable<Database['properties'][number]>;
}) {
  const t = useDatabasesTranslation();
  const columns = useMemo(() => groupRecords(records, group), [records, group]);
  const dnd = useBoardDnd(columns, view, group);
  const draggingId = useBoardUiStore((s) => s.draggingId);
  const dragging = draggingId ? records.find((r) => r.id === draggingId) : undefined;

  return (
    <DndContext {...dnd}>
      <div className="flex snap-x gap-3 overflow-x-auto pt-3 pb-6">
        {columns.map((column) => (
          <BoardColumn
            key={column.key}
            column={column}
            database={database}
            view={view}
            group={group}
          />
        ))}
      </div>
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {dragging ? (
            <div className="bg-background w-68 rotate-1 cursor-grabbing rounded-[9px] px-3 py-2.5 text-[13.5px] shadow-[0_0_0_1px_var(--color-border),0_12px_28px_-8px_rgb(0_0_0/0.3)]">
              <span className="font-medium">{dragging.title || t.untitled}</span>
              <CardBody record={dragging} database={database} view={view} group={group} />
            </div>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
