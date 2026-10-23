import { ListFilter, Plus, X } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { updateView } from '@/lib/data/databases';
import type { Database, Filter, View } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { OPERATORS } from '../utils/apply-view';
import { SELECT_CLASS, viewFields } from '../utils/view-fields';
import { FilterValueInput } from './filter-value-input';
import { ToolbarButton } from './toolbar-button';

export function FilterMenu({ database, view }: { database: Database; view: View }) {
  const t = useDatabasesTranslation();
  const fields = viewFields(database, t.name);
  const save = (filters: Filter[]) => void updateView(view.id, { filters });

  function change(id: string, patch: Partial<Filter>) {
    save(view.filters.map((filter) => (filter.id === id ? { ...filter, ...patch } : filter)));
  }

  function add() {
    const field = fields[0];
    if (field) {
      const operator = OPERATORS[field.type][0] ?? 'is';
      save([
        ...view.filters,
        { id: crypto.randomUUID(), propertyId: field.id, operator, value: null },
      ]);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton active={view.filters.length > 0}>
          <ListFilter className="size-4" />
          <span className="max-sm:sr-only">{t.filter}</span>
          {view.filters.length > 0 ? <span>{view.filters.length}</span> : null}
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(28rem,calc(100vw-2rem))] p-2">
        {view.filters.length === 0 ? (
          <p className="text-muted-foreground px-1 pb-2 text-sm">{t.noFilters}</p>
        ) : (
          <ul className="space-y-2 pb-2">
            {view.filters.map((filter) => {
              const field = fields.find((f) => f.id === filter.propertyId);
              const type = field?.type ?? 'text';
              const needsValue = filter.operator !== 'isEmpty' && filter.operator !== 'isNotEmpty';
              return (
                <li
                  key={filter.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-1.5 sm:grid-cols-[8rem_7rem_1fr_auto]"
                >
                  <select
                    value={filter.propertyId}
                    onChange={(event) => {
                      const next = fields.find((f) => f.id === event.target.value);
                      if (next) {
                        change(filter.id, {
                          propertyId: next.id,
                          operator: OPERATORS[next.type][0] ?? 'is',
                          value: null,
                        });
                      }
                    }}
                    className={SELECT_CLASS}
                  >
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(event) =>
                      change(filter.id, {
                        operator:
                          OPERATORS[type].find((op) => op === event.target.value) ??
                          filter.operator,
                      })
                    }
                    className={SELECT_CLASS}
                  >
                    {OPERATORS[type].map((op) => (
                      <option key={op} value={op}>
                        {t.operator[op]}
                      </option>
                    ))}
                  </select>
                  <div className="col-span-3 row-start-2 sm:col-span-1 sm:row-start-auto">
                    {needsValue ? (
                      <FilterValueInput
                        filter={filter}
                        type={type}
                        property={database.properties.find((p) => p.id === filter.propertyId)}
                        onChange={(value) => change(filter.id, { value })}
                      />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label={t.remove}
                    onClick={() => save(view.filters.filter((f) => f.id !== filter.id))}
                    className="text-muted-foreground hover:bg-hover col-start-3 row-start-1 flex size-8 items-center justify-center rounded-md sm:col-start-auto sm:row-start-auto"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <button
          type="button"
          onClick={add}
          className="text-muted-foreground hover:bg-hover hover:text-foreground flex h-8 w-full items-center gap-1.5 rounded-md px-1.5 text-sm"
        >
          <Plus className="size-4" />
          {t.addFilter}
        </button>
      </PopoverContent>
    </Popover>
  );
}
