import { Kanban, Plus, Table2, CalendarDays } from 'lucide-react';
import { useState } from 'react';

import { addRecord } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import type { ViewType } from '@/schemas/database.schema';

import { useDatabase } from '../hooks/use-database';
import { useDatabasesTranslation } from '../i18n';
import { TableView } from './table-view';

const VIEW_ICON: Record<ViewType, typeof Table2> = {
  table: Table2,
  board: Kanban,
  calendar: CalendarDays,
};

// The body of a database page: view tabs with a "New" action, then the active view.
// Which tab is open is local state — switching views shouldn't touch stored data.
export function DatabaseView({ databaseId }: { databaseId: string }) {
  const t = useDatabasesTranslation();
  const state = useDatabase(databaseId);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (state.status !== 'ready') {
    return null;
  }

  const { database, views, records } = state;
  const view = views.find((v) => v.id === activeId) ?? views[0];
  if (!view) {
    return null;
  }

  return (
    <section className="mt-6">
      <div className="flex items-end justify-between gap-2 border-b">
        <div role="tablist" aria-label={t.views} className="-mb-px flex min-w-0 overflow-x-auto">
          {views.map((v) => {
            const Icon = VIEW_ICON[v.type];
            return (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={v.id === view.id}
                onClick={() => setActiveId(v.id)}
                className={cn(
                  'flex h-10 shrink-0 items-center gap-1.5 border-b-2 px-2 text-sm',
                  v.id === view.id
                    ? 'border-foreground text-foreground'
                    : 'text-muted-foreground hover:text-foreground border-transparent',
                )}
              >
                <Icon className="size-4" />
                {v.name || t.viewType[v.type]}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => void addRecord(database.id)}
          className="bg-primary text-primary-foreground mb-1.5 flex h-8 shrink-0 items-center gap-1 rounded-md px-2.5 text-sm font-semibold transition-[filter] hover:brightness-95"
        >
          <Plus className="size-4" />
          {t.newRecord}
        </button>
      </div>

      {view.type === 'table' ? (
        <TableView database={database} view={view} records={records} />
      ) : (
        <p className="text-muted-foreground py-10 text-center text-sm">{t.comingSoon}</p>
      )}
    </section>
  );
}
