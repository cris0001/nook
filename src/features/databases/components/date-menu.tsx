import { CalendarDays, Check } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { updateView } from '@/lib/data/databases';
import type { Database, View } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { calendarDateProperty } from '../utils/calendar';
import { ToolbarButton } from './toolbar-button';

export function DateMenu({ database, view }: { database: Database; view: View }) {
  const t = useDatabasesTranslation();
  const dates = database.properties.filter((p) => p.type === 'date');
  const current = calendarDateProperty(database, view);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton>
          <CalendarDays className="size-4" />
          <span className="max-sm:sr-only">
            {current ? `${t.dateBy}: ${current.name}` : t.dateBy}
          </span>
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        <p className="text-muted-foreground px-2 py-1 text-xs">{t.dateByHint}</p>
        {dates.length === 0 ? (
          <p className="text-muted-foreground px-2 pb-2 text-sm">{t.noDateProperty}</p>
        ) : (
          dates.map((property) => (
            <button
              key={property.id}
              type="button"
              onClick={() => void updateView(view.id, { dateProperty: property.id })}
              className="hover:bg-hover flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm lg:h-8"
            >
              {property.name}
              {property.id === current?.id ? <Check className="ml-auto size-4" /> : null}
            </button>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}
