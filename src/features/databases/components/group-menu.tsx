import { Check, Columns3 } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { updateView } from '@/lib/data/databases';
import type { Database, View } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { ToolbarButton } from './toolbar-button';

// Board-only: which select property makes the columns.
export function GroupMenu({ database, view }: { database: Database; view: View }) {
  const t = useDatabasesTranslation();
  const selects = database.properties.filter((p) => p.type === 'select');
  const current = selects.find((p) => p.id === view.groupBy) ?? selects[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton>
          <Columns3 className="size-4" />
          <span className="max-sm:sr-only">{current ? current.name : t.groupBy}</span>
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        <p className="text-muted-foreground px-2 py-1 text-xs">{t.groupBy}</p>
        {selects.length === 0 ? (
          <p className="text-muted-foreground px-2 pb-2 text-sm">{t.noGroupProperty}</p>
        ) : (
          selects.map((property) => (
            <button
              key={property.id}
              type="button"
              onClick={() => void updateView(view.id, { groupBy: property.id })}
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
