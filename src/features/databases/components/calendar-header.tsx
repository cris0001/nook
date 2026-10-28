import { format, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useDateLocale } from '@/hooks/use-date-locale';
import { cn } from '@/lib/utils';

import { useDatabasesTranslation } from '../i18n';
import type { CalendarMode } from '../utils/calendar';

const NAV = 'hover:bg-hover flex size-8 items-center justify-center rounded-md';
const SEGMENT = 'h-7 rounded-md px-2.5 text-[13px] font-medium';

export function CalendarHeader({
  anchor,
  week,
  mode,
  undated,
  onMode,
  onStep,
  onToday,
}: {
  anchor: Date;
  week: string[];
  mode: CalendarMode;
  undated: number;
  onMode: (mode: CalendarMode) => void;
  onStep: (step: -1 | 1) => void;
  onToday: () => void;
}) {
  const t = useDatabasesTranslation();
  const { locale } = useDateLocale();
  const first = parseISO(week[0] ?? '');
  const last = parseISO(week.at(-1) ?? '');
  const title =
    mode === 'month'
      ? format(anchor, 'LLLL yyyy', { locale })
      : `${format(first, 'd MMM', { locale })} – ${format(last, 'd MMM yyyy', { locale })}`;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-3">
      <h3 className="font-heading min-w-0 text-lg font-bold first-letter:uppercase [font-variation-settings:'opsz'_96]">
        {title}
      </h3>
      <div className="flex items-center">
        <button type="button" aria-label={t.previous} onClick={() => onStep(-1)} className={NAV}>
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="hover:bg-hover h-8 rounded-md px-2 text-[13px] font-medium"
        >
          {t.today}
        </button>
        <button type="button" aria-label={t.next} onClick={() => onStep(1)} className={NAV}>
          <ChevronRight className="size-4" />
        </button>
      </div>
      {undated ? (
        <span className="text-muted-foreground font-mono text-[11px]">{t.undated(undated)}</span>
      ) : null}
      <div role="radiogroup" className="bg-well ml-auto flex rounded-lg p-0.5">
        {(['month', 'week'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={mode === option}
            onClick={() => onMode(option)}
            className={cn(
              SEGMENT,
              mode === option ? 'bg-background shadow-raised' : 'text-muted-foreground',
            )}
          >
            {t.calendarMode[option]}
          </button>
        ))}
      </div>
    </div>
  );
}
