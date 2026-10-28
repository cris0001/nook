import { useDroppable } from '@dnd-kit/core';

import { cn } from '@/lib/utils';
import type { PropertyDef } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useDatabasesTranslation } from '../i18n';
import { useCalendarUiStore } from '../stores/calendar-ui.store';
import { CalendarChip } from './calendar-chip';

export const UNDATED = 'undated';

export function UndatedTray({
  records,
  status,
}: {
  records: Page[];
  status: PropertyDef | undefined;
}) {
  const t = useDatabasesTranslation();
  const { setNodeRef } = useDroppable({ id: UNDATED });
  const over = useCalendarUiStore((s) => s.overDay === UNDATED);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'bg-surface mb-3 rounded-lg border border-dashed p-2',
        over && 'bg-primary-tint/50 border-primary',
      )}
    >
      <p className="text-muted-foreground px-1 pb-2 text-xs">{t.undatedHint}</p>
      {records.length ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-1.5">
          {records.map((record) => (
            <li key={record.id}>
              <CalendarChip record={record} status={status} late={false} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground px-1 pb-1 text-sm">{t.undatedEmpty}</p>
      )}
    </div>
  );
}
