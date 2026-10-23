import { Trash2 } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { deleteProperty, renameProperty } from '@/lib/data/databases';
import type { PropertyDef } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { PROPERTY_ICON } from '../utils/property-icon';
import { OptionList } from './option-list';

// A column header: type icon + name. Clicking opens a small editor to rename or delete
// the property (a popover rather than a menu, so the name input gets every keystroke).
// Select properties also list their options here, to reorder and edit them.
export function PropertyHeader({
  databaseId,
  property,
}: {
  databaseId: string;
  property: PropertyDef;
}) {
  const t = useDatabasesTranslation();
  const Icon = PROPERTY_ICON[property.type];

  function onDelete() {
    if (window.confirm(t.confirmDeleteProperty(property.name))) {
      void deleteProperty(databaseId, property.id);
    }
  }

  return (
    <Popover>
      <PopoverTrigger className="text-muted-foreground hover:bg-hover flex h-9 w-full items-center gap-1.5 px-2 text-left font-normal">
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{property.name}</span>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-1">
        <input
          autoFocus
          defaultValue={property.name}
          aria-label={t.propertyName}
          onChange={(event) => void renameProperty(databaseId, property.id, event.target.value)}
          className="mb-1 h-9 w-full rounded-md border bg-transparent px-2 text-sm outline-none"
        />
        <button
          type="button"
          onClick={onDelete}
          className="text-destructive hover:bg-hover flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm lg:h-8"
        >
          <Trash2 className="size-4" />
          {t.deleteProperty}
        </button>
        {property.type === 'select' || property.type === 'multiSelect' ? (
          <OptionList databaseId={databaseId} property={property} />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
