import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { reorderOptions } from '@/lib/data/databases';
import type { PropertyDef, SelectOption } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { DOT_STYLE } from '../utils/option-style';
import { OptionEditor } from './option-editor';

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
      <PopoverTrigger
        aria-label={t.editOption}
        className="hover:bg-hover flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 text-[13px] font-semibold"
      >
        <i
          aria-hidden
          className={cn('size-[7px] shrink-0 rounded-full', DOT_STYLE[option.color])}
        />
        <span className="truncate">{option.name}</span>
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
