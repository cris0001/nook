import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Link } from '@tanstack/react-router';

import { DoneCircle } from '@/components/done-circle';
import { useCan } from '@/hooks/use-can';
import { setRecordValue } from '@/lib/data/databases';
import { renamePage } from '@/lib/data/pages';
import { cn } from '@/lib/utils';
import type { Database, PropertyDef, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import type { BoardDropData } from '../hooks/use-board-dnd';
import { useDatabasesTranslation } from '../i18n';
import { useBoardUiStore } from '../stores/board-ui.store';
import { isFinished } from '../utils/board';
import { CardBody } from './card-body';
import { RecordActionsMenu } from './record-actions-menu';

const CARD = 'bg-background block rounded-[9px] px-3 py-2.5 text-[13.5px] shadow-raised';

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
  const canEdit = useCan('record.edit');
  const {
    setNodeRef: setDragRef,
    listeners,
    isDragging,
  } = useDraggable({
    id: record.id,
    disabled: !canEdit,
  });
  const data: BoardDropData = { kind: 'card', columnKey, recordId: record.id };
  const { setNodeRef: setDropRef } = useDroppable({ id: `card:${record.id}`, data });
  const lineAbove = useBoardUiStore(
    (s) => s.target?.columnKey === columnKey && s.target.beforeId === record.id,
  );
  const editing = useBoardUiStore((s) => s.editingId === record.id);
  const setEditing = useBoardUiStore((s) => s.setEditing);
  const done = isFinished(record, group);

  function toggleDone() {
    const target = done ? group.options[0] : group.options.at(-1);
    if (target) void setRecordValue(record.id, group.id, target.id);
  }

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
        <div
          className={cn(
            CARD,
            'group/card relative transition-[translate,box-shadow] hover:-translate-y-px hover:shadow-[0_0_0_1px_var(--color-border),0_6px_16px_-6px_rgb(0_0_0/0.18)]',
          )}
        >
          {/* The link covers the whole card (::after); the menu sits above it. */}
          <div className="flex items-start gap-2.5">
            <DoneCircle
              done={done}
              label={done ? t.markNotDone : t.markDone}
              disabled={!canEdit || group.options.length < 2}
              onToggle={toggleDone}
              className="relative z-10 mt-[3px]"
            />
            <Link
              to="/p/$pageId"
              params={{ pageId: record.id }}
              draggable={false}
              className={cn(
                'block min-w-0 flex-1 pr-6 font-medium after:absolute after:inset-0 after:content-[""]',
                !record.title && 'text-muted-foreground',
                done && 'text-muted-foreground',
              )}
            >
              {record.icon ? `${record.icon} ` : ''}
              {record.title || t.untitled}
            </Link>
          </div>
          <div className="pl-6.5">
            <CardBody record={record} database={database} view={view} group={group} />
          </div>
          <RecordActionsMenu
            recordId={record.id}
            title={record.title}
            className="absolute top-1.5 right-1.5 z-10 lg:opacity-0 lg:group-hover/card:opacity-100 lg:data-[state=open]:opacity-100"
          />
        </div>
      )}
    </li>
  );
}
