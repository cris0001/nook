import { Plus } from 'lucide-react';
import { useMemo } from 'react';

import { usePermissions } from '@/hooks/use-can';
import { useIncremental } from '@/hooks/use-incremental';
import { addRecord } from '@/lib/data/databases';
import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useDatabasesTranslation } from '../i18n';
import { statusPropertyOf } from '@/utils/progress';

import { AddPropertyButton } from './add-property-button';
import { PropertyHeader } from './property-header';
import { TableFooter } from './table-footer';
import { TableRow } from './table-row';

const ROW_STEP = 100;

export function TableView({
  database,
  view,
  records,
}: {
  database: Database;
  view: View;
  records: Page[];
}) {
  const t = useDatabasesTranslation();
  const columns = useMemo(
    () => database.properties.filter((p) => !view.hiddenProperties.includes(p.id)),
    [database.properties, view.hiddenProperties],
  );
  const { visible, hidden, sentinel, showMore } = useIncremental(records, ROW_STEP);
  const status = useMemo(() => statusPropertyOf(database), [database]);
  const allowed = usePermissions();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-divider border-b">
            <th className="min-w-56 px-2 text-left font-normal">
              <span className="eyebrow">{t.name}</span>
            </th>
            {columns.map((property) => (
              <th key={property.id} className="min-w-40 border-divider border-l p-0">
                <PropertyHeader databaseId={database.id} property={property} />
              </th>
            ))}
            <th className="w-10 border-divider border-l p-0">
              {allowed('database.editSchema') ? (
                <AddPropertyButton databaseId={database.id} />
              ) : null}
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((record) => (
            <TableRow
              key={record.id}
              databaseId={database.id}
              record={record}
              columns={columns}
              status={status}
            />
          ))}
          {hidden ? (
            <tr ref={sentinel}>
              <td colSpan={columns.length + 2} className="border-divider border-b p-0">
                <button
                  type="button"
                  onClick={showMore}
                  className="text-muted-foreground hover:bg-hover h-9 w-full px-2 text-left font-mono text-xs"
                >
                  {t.moreRows(hidden)}
                </button>
              </td>
            </tr>
          ) : null}
          {allowed('record.edit') ? (
            <tr>
              <td colSpan={columns.length + 2} className="border-divider border-b p-0">
                <button
                  type="button"
                  onClick={() => void addRecord(database.id)}
                  className="text-muted-foreground hover:bg-hover hover:text-foreground flex h-10 w-full items-center gap-2 px-2 text-sm lg:h-9"
                >
                  <Plus className="size-4" />
                  {t.newRecord}
                </button>
              </td>
            </tr>
          ) : null}
        </tbody>
        <TableFooter database={database} columns={columns} records={records} />
      </table>
    </div>
  );
}
