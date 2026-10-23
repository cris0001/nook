import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Link } from '@tanstack/react-router';

import { renamePage } from '@/lib/data/pages';
import { cn } from '@/lib/utils';
import type { Database, PropertyDef, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import type { BoardDropData } from '../hooks/use-board-dnd';
import { useDatabasesTranslation } from '../i18n';
import { useBoardUiStore } from '../stores/board-ui.store';
import { CardBody } from './card-body';

const CARD = 'bg-background block rounded-lg border px-3 py-2 text-sm shadow-xs';

// A record on the board. The whole card drags (after a few pixels / a long press) and
// otherwise opens the record. Right after "Add a card" it shows a title input instead,
// so the new card can be named without leaving the board.
export function BoardCard({
  record,
  columnKey,
  database,
  view,
  group,
}: {
  record: Page;
  columnKey: string;
  database: Database;
  view: View;
  group: PropertyDef;
}) {
  const t = useDatabasesTranslation();
  const { setNodeRef: setDragRef, listeners, isDragging } = useDraggable({ id: record.id });
  const data: BoardDropData = { kind: 'card', columnKey, recordId: record.id };
  const { setNodeRef: setDropRef } = useDroppable({ id: `card:${record.id}`, data });
  const lineAbove = useBoardUiStore(
    (s) => s.target?.columnKey === columnKey && s.target.beforeId === record.id,
  );
  const editing = useBoardUiStore((s) => s.editingId === record.id);
  const setEditing = useBoardUiStore((s) => s.setEditing);

  return (
    <li
      ref={(element) => {
        setDragRef(element);
        setDropRef(element);
      }}
      {...listeners}
      className={cn('relative', isDragging && 'opacity-40')}
    >
      {lineAbove ? (
        <span aria-hidden className="bg-primary absolute inset-x-0 -top-1.5 h-0.5 rounded-full" />
      ) : null}
      {editing ? (
        <div className={CARD}>
          <input
            autoFocus
            defaultValue={record.title}
            placeholder={t.untitled}
            onChange={(event) => void renamePage(record.id, event.target.value)}
            onBlur={() => setEditing(null)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Escape') setEditing(null);
            }}
            className="w-full bg-transparent font-medium outline-none"
          />
        </div>
      ) : (
        <Link
          to="/p/$pageId"
          params={{ pageId: record.id }}
          draggable={false}
          className={cn(CARD, 'hover:border-foreground/25 transition-colors')}
        >
          <span className={cn('font-medium', !record.title && 'text-muted-foreground')}>
            {record.icon ? `${record.icon} ` : ''}
            {record.title || t.untitled}
          </span>
          <CardBody record={record} database={database} view={view} group={group} />
        </Link>
      )}
    </li>
  );
}
