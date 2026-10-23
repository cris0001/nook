import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Database, PropertyDef, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useDueLabel } from '@/hooks/use-due-label';
import { DUE_CHIP, DUE_TONE } from '../utils/due-style';
import { isFinished } from '../utils/board';
import { OptionTag } from './option-tag';

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
  const dueLabel = useDueLabel();
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
      const due = dueLabel(value, isFinished(record, group));
      return [
        <span key={property.id} className={cn(DUE_CHIP, DUE_TONE[due.tone])}>
          {due.text}
        </span>,
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
    <div className="mt-2 flex flex-wrap items-center gap-1.5">{values}</div>
  ) : null;
}
