import { useDroppable } from '@dnd-kit/core';
import { parseISO } from 'date-fns';
import { Plus } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { PropertyDef } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useDatabasesTranslation } from '../i18n';
import { useCalendarUiStore } from '../stores/calendar-ui.store';
import type { CalendarMode } from '../utils/calendar';
import { CalendarChip } from './calendar-chip';

const MONTH_LIMIT = 3;

export function CalendarDay({
  day,
  records,
  status,
  mode,
  today,
  inMonth,
  onAdd,
}: {
  day: string;
  records: Page[];
  status: PropertyDef | undefined;
  mode: CalendarMode;
  today: string;
  inMonth: boolean;
  onAdd: ((day: string) => void) | null;
}) {
  const t = useDatabasesTranslation();
  const { setNodeRef } = useDroppable({ id: `day:${day}` });
  const over = useCalendarUiStore((s) => s.overDay === day);
  const weekend = [0, 6].includes(parseISO(day).getDay());
  const limit = mode === 'month' ? MONTH_LIMIT : Infinity;
  const shown = records.slice(0, limit);
  const hidden = records.slice(limit);
  const colorOf = (record: Page) =>
    status?.options.find((o) => o.id === record.properties[status.id])?.color ?? 'gray';
  const chip = (record: Page) => (
    <li key={record.id}>
      <CalendarChip record={record} status={status} late={day < today} />
    </li>
  );

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'group/day border-divider relative flex min-w-0 flex-col gap-1 border-t border-l p-1 sm:p-1.5',
        mode === 'month' ? 'min-h-24 sm:min-h-28' : 'min-h-64',
        !inMonth && 'bg-surface/60',
        inMonth && weekend && 'bg-surface/30',
        over && 'bg-primary-tint/50 ring-primary ring-1 ring-inset',
      )}
    >
      <div className="flex h-6 items-center justify-between">
        <span
          className={cn(
            'flex h-6 min-w-6 items-center justify-center rounded-full px-1 font-mono text-[11.5px]',
            day === today && 'bg-primary text-primary-foreground font-semibold',
            day !== today && !inMonth && 'text-muted-foreground',
            day !== today && inMonth && 'text-muted-foreground',
          )}
        >
          {parseISO(day).getDate()}
        </span>
        {onAdd ? (
          <button
            type="button"
            aria-label={t.addOnDay}
            title={t.addOnDay}
            onClick={() => onAdd(day)}
            className="text-muted-foreground hover:bg-hover hidden size-6 items-center justify-center rounded-md sm:flex lg:opacity-0 lg:group-hover/day:opacity-100 lg:focus-visible:opacity-100"
          >
            <Plus className="size-3.5" />
          </button>
        ) : null}
      </div>
      {records.length ? (
        <Popover>
          <PopoverTrigger
            aria-label={t.dayRecords(records.length)}
            className="flex flex-wrap gap-1 px-1 sm:hidden"
          >
            {records.map((record) => (
              <i
                key={record.id}
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ background: `var(--dot-${colorOf(record)})` }}
              />
            ))}
          </PopoverTrigger>
          <PopoverContent className="w-64 p-1.5 sm:hidden">
            <ul className="flex flex-col gap-1">{records.map(chip)}</ul>
            {onAdd ? (
              <button
                type="button"
                onClick={() => onAdd(day)}
                className="text-muted-foreground hover:bg-hover mt-1 flex h-8 w-full items-center gap-1.5 rounded-md px-1.5 text-[13px]"
              >
                <Plus className="size-3.5" />
                {t.addOnDay}
              </button>
            ) : null}
          </PopoverContent>
        </Popover>
      ) : null}
      <ul className="flex flex-col gap-1 max-sm:hidden">
        {shown.map(chip)}
        {hidden.length ? (
          <li>
            <Popover>
              <PopoverTrigger className="text-muted-foreground hover:text-foreground hover:bg-hover h-5 w-full rounded px-1.5 text-left text-[11.5px]">
                {t.moreOnDay(hidden.length)}
              </PopoverTrigger>
              <PopoverContent className="w-60 p-1.5">
                <ul className="flex flex-col gap-1">{records.map(chip)}</ul>
              </PopoverContent>
            </Popover>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
