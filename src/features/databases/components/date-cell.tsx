import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setRecordValue } from '@/lib/data/databases';

import { useDueLabel } from '@/hooks/use-due-label';
import { cn } from '@/lib/utils';
import { useDatabasesTranslation } from '../i18n';
import { todayKey } from '@/utils/dates';
import { MonthCalendar } from './month-calendar';

export function DateCell({
  recordId,
  propertyId,
  value,
  finished = false,
  readOnly = false,
}: {
  recordId: string;
  propertyId: string;
  value: string | null;
  finished?: boolean;
  readOnly?: boolean;
}) {
  const t = useDatabasesTranslation();
  const dueLabel = useDueLabel();
  const due = value ? dueLabel(value, finished) : null;
  const [open, setOpen] = useState(false);

  function pick(day: string | null) {
    void setRecordValue(recordId, propertyId, day);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={readOnly}
        className={cn(
          'flex h-full min-h-9 w-full items-center px-2 text-left font-mono text-[12px]',
          due?.tone === 'late' && 'text-destructive',
          due?.tone === 'today' && 'text-primary-text font-semibold',
          due?.tone === 'plain' && 'text-muted-foreground',
        )}
      >
        {due?.text}
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <MonthCalendar value={value} onPick={pick} />
        <div className="mt-2 flex gap-1 border-t pt-2">
          <button
            type="button"
            onClick={() => pick(todayKey())}
            className="hover:bg-hover h-8 flex-1 rounded-md border text-sm"
          >
            {t.today}
          </button>
          <button
            type="button"
            onClick={() => pick(null)}
            className="hover:bg-hover text-muted-foreground h-8 flex-1 rounded-md border text-sm"
          >
            {t.clear}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
