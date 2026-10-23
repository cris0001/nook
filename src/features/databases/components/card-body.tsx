import { format, parseISO } from 'date-fns';
import { CalendarClock, Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Database, PropertyDef, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useDateLocale } from '../hooks/use-date-locale';
import { useDatabasesTranslation } from '../i18n';
import { isOverdue } from '../utils/board';
import { OptionTag } from './option-tag';

// What a card shows under its title: every visible, non-empty property except the one
// the board is grouped by (the column already says it). Past dates on unfinished
// cards turn red with an "overdue" label.
export function CardBody({
  record,
  database,
  view,
  group,
}: {
  record: Page;
  database: Database;
  view: View;
  group: PropertyDef;
}) {
  const t = useDatabasesTranslation();
  const { locale } = useDateLocale();
  const shown = database.properties.filter(
    (p) => p.id !== group.id && !view.hiddenProperties.includes(p.id),
  );

  const values = shown.flatMap((property) => {
    const value = record.properties[property.id];
    if (value === null || value === undefined || value === '' || value === false) {
      return [];
    }
    if (Array.isArray(value) || property.type === 'select') {
      const ids = Array.isArray(value) ? value : [value];
      const options = property.options.filter((o) => ids.includes(o.id));
      return options.length
        ? [
            <div key={property.id} className="flex flex-wrap gap-1">
              {options.map((o) => (
                <OptionTag key={o.id} option={o} />
              ))}
            </div>,
          ]
        : [];
    }
    if (property.type === 'date' && typeof value === 'string') {
      const late = isOverdue(value, record, group);
      return [
        <p
          key={property.id}
          className={cn(
            'flex items-center gap-1 font-mono text-[11px]',
            late ? 'text-destructive font-medium' : 'text-muted-foreground',
          )}
        >
          <CalendarClock className="size-3" />
          {format(parseISO(value), 'd MMM yyyy', { locale })}
          {late ? <span className="font-medium">· {t.overdue}</span> : null}
        </p>,
      ];
    }
    if (property.type === 'checkbox') {
      return [
        <p
          key={property.id}
          className="text-muted-foreground flex items-center gap-1 text-[11.5px]"
        >
          <Check className="size-3.5" />
          {property.name}
        </p>,
      ];
    }
    return [
      <p key={property.id} className="text-muted-foreground max-w-full truncate text-[11.5px]">
        {String(value)}
      </p>,
    ];
  });

  return values.length ? (
    <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">{values}</div>
  ) : null;
}
