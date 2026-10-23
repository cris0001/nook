import { Plus } from 'lucide-react';

import { addRecord } from '@/lib/data/databases';
import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { useDatabasesTranslation } from '../i18n';
import { AddPropertyButton } from './add-property-button';
import { PropertyCell } from './property-cell';
import { PropertyHeader } from './property-header';
import { RecordTitleCell } from './record-title-cell';

// Spreadsheet-style view: a Name column plus one column per visible property, every cell
// editable in place. Wider than the screen on phones, so it scrolls sideways inside its
// own box while the page stays put.
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

  return (
    <div className="overflow-x-auto">
      <table className="w-max min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-y">
            <th className="text-muted-foreground w-64 min-w-64 px-2 text-left font-normal">
              {t.name}
            </th>
            {columns.map((property) => (
              <th key={property.id} className="w-48 min-w-48 border-l p-0">
                <PropertyHeader databaseId={database.id} property={property} />
              </th>
            ))}
            <th className="w-10 border-l p-0">
              <AddPropertyButton databaseId={database.id} />
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-hover/50 border-b">
              <td className="p-0">
                <RecordTitleCell record={record} />
              </td>
              {columns.map((property) => (
                <td key={property.id} className="border-l p-0 align-middle">
                  <PropertyCell
                    databaseId={database.id}
                    recordId={record.id}
                    property={property}
                    value={record.properties[property.id] ?? null}
                  />
                </td>
              ))}
              <td className="border-l" />
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={() => void addRecord(database.id)}
        className="text-muted-foreground hover:bg-hover hover:text-foreground flex h-10 w-full items-center gap-2 border-b px-2 text-sm lg:h-9"
      >
        <Plus className="size-4" />
        {t.newRecord}
      </button>
    </div>
  );
}
