import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { reorderOptions } from '@/lib/data/databases';
import type { PropertyDef, SelectOption } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { OptionEditor } from './option-editor';
import { OptionTag } from './option-tag';

// A column's tag doubles as its menu: edit the option, or nudge the column left/right
// (swapping options, since option order is column order).
export function BoardColumnMenu({
  databaseId,
  property,
  option,
}: {
  databaseId: string;
  property: PropertyDef;
  option: SelectOption;
}) {
  const t = useDatabasesTranslation();
  const [open, setOpen] = useState(false);
  const ids = property.options.map((o) => o.id);
  const index = ids.indexOf(option.id);

  function move(by: -1 | 1) {
    const next = [...ids];
    const other = next[index + by];
    if (other) {
      next[index + by] = option.id;
      next[index] = other;
      void reorderOptions(databaseId, property.id, next);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger aria-label={t.editOption} className="min-w-0 rounded">
        <OptionTag option={option} className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="p-1.5">
        <div className="mb-1 flex gap-1">
          {(
            [
              [-1, t.moveLeft, ChevronLeft],
              [1, t.moveRight, ChevronRight],
            ] as const
          ).map(([by, label, Icon]) => (
            <button
              key={by}
              type="button"
              disabled={!ids[index + by]}
              onClick={() => move(by)}
              className="hover:bg-hover flex h-8 flex-1 items-center justify-center gap-1 rounded-md border text-xs disabled:opacity-40"
            >
              {by === -1 ? <Icon className="size-3.5" /> : null}
              {label}
              {by === 1 ? <Icon className="size-3.5" /> : null}
            </button>
          ))}
        </div>
        <OptionEditor
          databaseId={databaseId}
          propertyId={property.id}
          option={option}
          onDone={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
