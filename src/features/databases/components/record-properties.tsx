import type { Page } from '@/schemas/page.schema';

import { useDatabase } from '../hooks/use-database';
import { PROPERTY_ICON } from '../utils/property-icon';
import { statusPropertyOf } from '@/utils/progress';

import { isFinished } from '../utils/board';
import { PropertyCell } from './property-cell';

export function RecordProperties({ record }: { record: Page }) {
  const state = useDatabase(record.parentId ?? '');

  if (state.status !== 'ready') {
    return null;
  }

  return (
    <dl className="mt-6 grid grid-cols-[minmax(7rem,10rem)_1fr] gap-y-0.5 text-sm">
      {state.database.properties.map((property) => {
        const Icon = PROPERTY_ICON[property.type];
        return (
          <div key={property.id} className="contents">
            <dt className="text-muted-foreground flex min-h-9 items-center gap-1.5 pr-2">
              <Icon className="size-3.5 shrink-0" />
              <span className="truncate">{property.name}</span>
            </dt>
            <dd className="hover:bg-hover min-w-0 rounded-md">
              <PropertyCell
                databaseId={state.database.id}
                recordId={record.id}
                property={property}
                value={record.properties[property.id] ?? null}
                finished={isFinished(record, statusPropertyOf(state.database))}
              />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
