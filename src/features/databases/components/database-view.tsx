import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { usePermissions } from '@/hooks/use-can';
import { addRecord } from '@/lib/data/databases';

import { useDatabase } from '../hooks/use-database';
import { useDatabasesTranslation } from '../i18n';
import { filterRecords, sortRecords } from '../utils/apply-view';
import { BoardView } from './board-view';
import { CalendarView } from './calendar-view';
import { DatabaseSummary } from './database-summary';
import { DateMenu } from './date-menu';
import { FilterMenu } from './filter-menu';
import { GroupMenu } from './group-menu';
import { PropertiesMenu } from './properties-menu';
import { SortMenu } from './sort-menu';
import { TableView } from './table-view';
import { ViewTabs } from './view-tabs';

export function DatabaseView({ databaseId }: { databaseId: string }) {
  const t = useDatabasesTranslation();
  const state = useDatabase(databaseId);
  const [activeId, setActiveId] = useState<string | null>(null);
  const allowed = usePermissions();

  const ready = state.status === 'ready' ? state : null;
  const view =
    ready?.views.find((v) => v.id === activeId) ??
    ready?.views.find((v) => v.type === 'board') ??
    ready?.views[0];
  const visible = useMemo(
    () =>
      ready && view
        ? sortRecords(
            filterRecords(ready.records, view.filters, ready.database),
            view.sorts,
            ready.database,
          )
        : [],
    [ready, view],
  );

  if (!ready || !view) {
    return null;
  }

  const { database, views } = ready;

  return (
    <section className="mt-1">
      <DatabaseSummary database={database} records={ready.records} />
      <div className="border-divider mt-6 flex flex-wrap items-center gap-2 border-b pb-3">
        <ViewTabs views={views} activeId={view.id} onSelect={setActiveId} />
        <div className="ml-auto flex items-center gap-0.5">
          {allowed('page.edit') ? (
            <>
              {view.type === 'board' ? <GroupMenu database={database} view={view} /> : null}
              {view.type === 'calendar' ? <DateMenu database={database} view={view} /> : null}
              <FilterMenu database={database} view={view} />
              <SortMenu database={database} view={view} />
              <PropertiesMenu database={database} view={view} />
            </>
          ) : null}
          {allowed('record.edit') ? (
            <button
              type="button"
              onClick={() => void addRecord(database.id)}
              className="btn-primary ml-1.5 h-7 shrink-0 px-2.5 text-[13px]"
            >
              <Plus className="size-4" />
              {t.newRecord}
            </button>
          ) : null}
        </div>
      </div>

      {view.type === 'table' ? (
        <TableView database={database} view={view} records={visible} />
      ) : view.type === 'board' ? (
        <BoardView database={database} view={view} records={visible} />
      ) : (
        <CalendarView database={database} view={view} records={visible} />
      )}
    </section>
  );
}
