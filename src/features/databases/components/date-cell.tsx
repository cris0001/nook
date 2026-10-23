import { format, parseISO } from 'date-fns';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setRecordValue } from '@/lib/data/databases';

import { useDateLocale } from '../hooks/use-date-locale';
import { useDatabasesTranslation } from '../i18n';
import { todayKey } from '@/utils/dates';
import { MonthCalendar } from './month-calendar';

export function DateCell({
  recordId,
  propertyId,
  value,
}: {
  recordId: string;
  propertyId: string;
  value: string | null;
}) {
  const t = useDatabasesTranslation();
  const { locale } = useDateLocale();
  const [open, setOpen] = useState(false);

  function pick(day: string | null) {
    void setRecordValue(recordId, propertyId, day);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-full min-h-9 w-full items-center px-2 text-left text-sm tabular-nums">
        {value ? format(parseISO(value), 'd MMM yyyy', { locale }) : null}
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
