import { useDraggable } from '@dnd-kit/core';
import { Link } from '@tanstack/react-router';

import { useCan } from '@/hooks/use-can';
import { useDebouncedRename } from '@/hooks/use-debounced-rename';
import { cn } from '@/lib/utils';
import type { PropertyDef } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useDatabasesTranslation } from '../i18n';
import { useCalendarUiStore } from '../stores/calendar-ui.store';
import { isFinished } from '../utils/board';

export const CHIP =
  'bg-background shadow-raised flex h-6 w-full min-w-0 items-center gap-1.5 rounded-[5px] px-1.5 text-left text-[12px]';

export function CalendarChip({
  record,
  status,
  late,
}: {
  record: Page;
  status: PropertyDef | undefined;
  late: boolean;
}) {
  const t = useDatabasesTranslation();
  const canEdit = useCan('record.edit');
  const { setNodeRef, listeners, isDragging } = useDraggable({ id: record.id, disabled: !canEdit });
  const editing = useCalendarUiStore((s) => s.editingId === record.id);
  const setEditing = useCalendarUiStore((s) => s.setEditing);
  const rename = useDebouncedRename(record.id);
  const done = isFinished(record, status);
  const option = status?.options.find((o) => o.id === record.properties[status.id]);

  const dot = (
    <i
      aria-hidden
      className="size-1.5 shrink-0 rounded-full"
      style={{ background: `var(--dot-${option?.color ?? 'gray'})` }}
    />
  );

  if (editing) {
    return (
      <div className={CHIP}>
        {dot}
        <input
          autoFocus
          defaultValue={record.title}
          placeholder={t.untitled}
          onChange={(event) => rename(event.target.value)}
          onBlur={() => {
            rename.flush();
            setEditing(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === 'Escape') event.currentTarget.blur();
          }}
          className="min-w-0 flex-1 bg-transparent font-medium outline-none"
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} {...listeners} className={cn(isDragging && 'opacity-40')}>
      <Link
        to="/p/$pageId"
        params={{ pageId: record.id }}
        draggable={false}
        title={record.title || t.untitled}
        className={cn(CHIP, 'hover:bg-hover')}
      >
        {dot}
        <span
          className={cn(
            'truncate font-medium',
            done && 'text-muted-foreground line-through',
            late && !done && 'text-destructive',
            !record.title && 'text-muted-foreground',
          )}
        >
          {record.icon ? `${record.icon} ` : ''}
          {record.title || t.untitled}
        </span>
      </Link>
    </div>
  );
}
