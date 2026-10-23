import { ArrowUpDown, Plus, X } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { updateView } from '@/lib/data/databases';
import type { Database, Sort, View } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { SELECT_CLASS, viewFields } from '../utils/view-fields';
import { ToolbarButton } from './toolbar-button';

export function SortMenu({ database, view }: { database: Database; view: View }) {
  const t = useDatabasesTranslation();
  const fields = viewFields(database, t.name);
  const save = (sorts: Sort[]) => void updateView(view.id, { sorts });
  const unused = fields.find((f) => !view.sorts.some((s) => s.propertyId === f.id));

  function change(index: number, patch: Partial<Sort>) {
    save(view.sorts.map((sort, i) => (i === index ? { ...sort, ...patch } : sort)));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton active={view.sorts.length > 0}>
          <ArrowUpDown className="size-4" />
          <span className="max-sm:sr-only">{t.sort}</span>
          {view.sorts.length > 0 ? <span>{view.sorts.length}</span> : null}
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-2">
        {view.sorts.length === 0 ? (
          <p className="text-muted-foreground px-1 pb-2 text-sm">{t.noSorts}</p>
        ) : (
          <ul className="space-y-1.5 pb-2">
            {view.sorts.map((sort, index) => (
              <li key={sort.propertyId} className="flex items-center gap-1.5">
                <select
                  value={sort.propertyId}
                  onChange={(event) => change(index, { propertyId: event.target.value })}
                  className={`${SELECT_CLASS} flex-1`}
                >
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sort.direction}
                  onChange={(event) =>
                    change(index, { direction: event.target.value === 'desc' ? 'desc' : 'asc' })
                  }
                  className={SELECT_CLASS}
                >
                  <option value="asc">{t.ascending}</option>
                  <option value="desc">{t.descending}</option>
                </select>
                <button
                  type="button"
                  aria-label={t.remove}
                  onClick={() => save(view.sorts.filter((_, i) => i !== index))}
                  className="text-muted-foreground hover:bg-hover flex size-8 shrink-0 items-center justify-center rounded-md"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {unused ? (
          <button
            type="button"
            onClick={() => save([...view.sorts, { propertyId: unused.id, direction: 'asc' }])}
            className="text-muted-foreground hover:bg-hover hover:text-foreground flex h-8 w-full items-center gap-1.5 rounded-md px-1.5 text-sm"
          >
            <Plus className="size-4" />
            {t.addSort}
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
