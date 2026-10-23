import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addProperty } from '@/lib/data/databases';
import { PROPERTY_TYPES } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { PROPERTY_ICON } from '../utils/property-icon';

// "+" at the end of the header row: name the property (optional — it defaults to the
// type's name) and pick a type to add it.
export function AddPropertyButton({ databaseId }: { databaseId: string }) {
  const t = useDatabasesTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setName('');
      }}
    >
      <PopoverTrigger
        aria-label={t.addProperty}
        title={t.addProperty}
        className="text-muted-foreground hover:bg-hover flex size-9 items-center justify-center"
      >
        <Plus className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-1">
        <input
          autoFocus
          value={name}
          placeholder={t.propertyName}
          onChange={(event) => setName(event.target.value)}
          className="mb-1 h-9 w-full rounded-md border bg-transparent px-2 text-sm outline-none"
        />
        {PROPERTY_TYPES.map((type) => {
          const Icon = PROPERTY_ICON[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                void addProperty(databaseId, type, name.trim() || t.propertyType[type]);
                setOpen(false);
              }}
              className="hover:bg-hover flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm lg:h-8"
            >
              <Icon className="text-muted-foreground size-4" />
              {t.propertyType[type]}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
