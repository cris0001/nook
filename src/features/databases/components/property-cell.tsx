import { ExternalLink } from 'lucide-react';

import { useCan } from '@/hooks/use-can';
import { setRecordValue } from '@/lib/data/databases';
import type { PropertyDef, PropertyValue } from '@/schemas/database.schema';

import { DateCell } from './date-cell';
import { SelectCell } from './select-cell';

const INPUT =
  'h-full min-h-9 w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground/60';

export function PropertyCell({
  databaseId,
  recordId,
  property,
  value,
  finished = false,
}: {
  databaseId: string;
  recordId: string;
  property: PropertyDef;
  value: PropertyValue;
  finished?: boolean;
}) {
  const readOnly = !useCan('record.edit');
  const save = (next: PropertyValue) => void setRecordValue(recordId, property.id, next);
  const text = typeof value === 'string' ? value : '';

  switch (property.type) {
    case 'select':
    case 'multiSelect':
      return (
        <SelectCell
          databaseId={databaseId}
          recordId={recordId}
          property={property}
          value={value}
          readOnly={readOnly}
        />
      );
    case 'checkbox':
      return (
        <label className="flex h-full min-h-9 items-center px-2">
          <input
            type="checkbox"
            checked={value === true}
            disabled={readOnly}
            onChange={(event) => save(event.target.checked)}
            className="accent-primary size-4"
          />
        </label>
      );
    case 'number':
      return (
        <input
          type="number"
          inputMode="decimal"
          defaultValue={typeof value === 'number' ? value : ''}
          readOnly={readOnly}
          onChange={(event) => save(event.target.value === '' ? null : Number(event.target.value))}
          className={`${INPUT} text-right tabular-nums`}
        />
      );
    case 'date':
      return (
        <DateCell
          recordId={recordId}
          propertyId={property.id}
          value={text || null}
          finished={finished}
          readOnly={readOnly}
        />
      );
    case 'url':
      return (
        <div className="flex h-full items-center">
          <input
            type="url"
            defaultValue={text}
            readOnly={readOnly}
            onChange={(event) => save(event.target.value || null)}
            className={INPUT}
          />
          {text ? (
            <a
              href={text}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground px-2"
            >
              <ExternalLink className="size-3.5" />
            </a>
          ) : null}
        </div>
      );
    case 'text':
      return (
        <input
          defaultValue={text}
          readOnly={readOnly}
          onChange={(event) => save(event.target.value || null)}
          className={INPUT}
        />
      );
  }
}
