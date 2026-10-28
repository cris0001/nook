import { Check, Plus } from 'lucide-react';
import { useState } from 'react';

import { useCan } from '@/hooks/use-can';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addOption, toggleRecordOption } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import type { PropertyDef, PropertyValue } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { DOT_STYLE } from '../utils/option-style';
import { OptionEditButton } from './option-edit-button';
import { OptionTag } from './option-tag';

export function SelectCell({
  databaseId,
  recordId,
  property,
  value,
  readOnly = false,
}: {
  databaseId: string;
  recordId: string;
  property: PropertyDef;
  value: PropertyValue;
  readOnly?: boolean;
}) {
  const t = useDatabasesTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const canEditSchema = useCan('database.editSchema');
  const multi = property.type === 'multiSelect';
  const selected = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
  const chosen = property.options.filter((o) => selected.includes(o.id));
  const needle = query.trim().toLowerCase();
  const matches = property.options.filter((o) => o.name.toLowerCase().includes(needle));
  const exact = property.options.some((o) => o.name.toLowerCase() === needle);

  function toggle(optionId: string) {
    void toggleRecordOption(recordId, property.id, optionId, multi);
    if (!multi) {
      setOpen(false);
    }
    setQuery('');
  }

  // The query is cleared before the async write, so anything typed meanwhile starts a
  // fresh search instead of being glued onto the name being created.
  async function create() {
    const name = query.trim();
    setQuery('');
    const created = await addOption(databaseId, property.id, name);
    toggle(created.id);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={readOnly}
        aria-label={`${property.name}: ${chosen.map((o) => o.name).join(', ') || '—'}`}
        className="flex h-full min-h-9 w-full flex-wrap items-center gap-1 px-2 py-1 text-left"
      >
        {multi ? (
          chosen.map((option) => <OptionTag key={option.id} option={option} />)
        ) : chosen[0] ? (
          <span className="flex items-center gap-2 text-[13px]">
            <i
              aria-hidden
              className={cn('size-[7px] shrink-0 rounded-full', DOT_STYLE[chosen[0].color])}
            />
            {chosen[0].name}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1">
        <input
          autoFocus
          value={query}
          placeholder={t.searchOrCreate}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && canEditSchema && needle && !exact) void create();
          }}
          className="mb-1 h-9 w-full rounded-md border bg-transparent px-2 text-sm outline-none"
        />
        <ul className="max-h-60 overflow-y-auto">
          {matches.map((option) => (
            <li key={option.id} className="group/option flex items-center">
              <button
                type="button"
                onClick={() => toggle(option.id)}
                className="hover:bg-hover flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md px-2 lg:h-8"
              >
                <OptionTag option={option} />
                {selected.includes(option.id) ? <Check className="ml-auto size-4" /> : null}
              </button>
              {canEditSchema ? (
                <OptionEditButton
                  databaseId={databaseId}
                  propertyId={property.id}
                  option={option}
                  className="lg:opacity-0 lg:group-hover/option:opacity-100 lg:data-[state=open]:opacity-100"
                />
              ) : null}
            </li>
          ))}
          {canEditSchema && needle && !exact ? (
            <li>
              <button
                type="button"
                onClick={() => void create()}
                className="hover:bg-hover text-muted-foreground flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm lg:h-8"
              >
                <Plus className="size-4" />
                <span className="truncate">{t.createOption(query.trim())}</span>
              </button>
            </li>
          ) : null}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
