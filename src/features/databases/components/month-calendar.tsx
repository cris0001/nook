import { addMonths, format, isSameMonth, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { useDateLocale } from '@/hooks/use-date-locale';
import { useDatabasesTranslation } from '../i18n';
import { todayKey } from '@/utils/dates';
import { monthGrid } from '../utils/month-grid';

export function MonthCalendar({
  value,
  onPick,
}: {
  value: string | null;
  onPick: (day: string) => void;
}) {
  const t = useDatabasesTranslation();
  const { locale, weekStartsOn } = useDateLocale();
  const [month, setMonth] = useState(() => (value ? parseISO(value) : new Date()));
  const days = monthGrid(month, weekStartsOn);
  const today = todayKey();

  return (
    <div className="w-64">
      <div className="mb-1 flex items-center justify-between">
        <button
          type="button"
          aria-label={t.previousMonth}
          onClick={() => setMonth((m) => addMonths(m, -1))}
          className="hover:bg-hover flex size-8 items-center justify-center rounded-md"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-medium capitalize">{format(month, 'LLLL yyyy', { locale })}</p>
        <button
          type="button"
          aria-label={t.nextMonth}
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="hover:bg-hover flex size-8 items-center justify-center rounded-md"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="text-muted-foreground grid grid-cols-7 text-center text-xs">
        {days.slice(0, 7).map((day) => (
          <span key={day} className="py-1">
            {format(parseISO(day), 'EEEEEE', { locale })}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const date = parseISO(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onPick(day)}
              className={cn(
                'flex h-8 items-center justify-center rounded-md text-sm tabular-nums',
                !isSameMonth(date, month) && 'text-muted-foreground/50',
                day === value
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'hover:bg-hover',
                day === today && day !== value && 'ring-foreground/30 ring-1 ring-inset',
              )}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
