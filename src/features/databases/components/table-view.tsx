import { Plus } from 'lucide-react';

import { usePermissions } from '@/hooks/use-can';
import { addRecord } from '@/lib/data/databases';
import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useDatabasesTranslation } from '../i18n';
import { statusPropertyOf } from '@/utils/progress';

import { isFinished } from '../utils/board';
import { AddPropertyButton } from './add-property-button';
import { PropertyCell } from './property-cell';
import { PropertyHeader } from './property-header';
import { RecordTitleCell } from './record-title-cell';
import { TableFooter } from './table-footer';

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
  const columns = database.properties.filter((p) => !view.hiddenProperties.includes(p.id));
  const status = statusPropertyOf(database);
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
          {records.map((record) => (
            <tr key={record.id} className="group/row hover:bg-hover/50 border-divider border-b">
              <td className="p-0 group-hover/row:shadow-[inset_2.5px_0_0_var(--color-primary)]">
                <RecordTitleCell record={record} />
              </td>
              {columns.map((property) => (
                <td key={property.id} className="border-divider border-l p-0 align-middle">
                  <PropertyCell
                    databaseId={database.id}
                    recordId={record.id}
                    property={property}
                    value={record.properties[property.id] ?? null}
                    finished={isFinished(record, status)}
                  />
                </td>
              ))}
              <td className="border-divider border-l" />
            </tr>
          ))}
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
