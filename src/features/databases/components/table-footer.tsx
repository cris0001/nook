import type { Database, PropertyDef } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { todayKey } from '@/utils/dates';
import { statusPropertyOf } from '@/utils/progress';

import { useDatabasesTranslation } from '../i18n';
import { isFinished } from '../utils/board';

export function TableFooter({
  database,
  columns,
  records,
}: {
  database: Database;
  columns: PropertyDef[];
  records: Page[];
}) {
  const t = useDatabasesTranslation();
  if (records.length === 0) {
    return null;
  }

  const status = statusPropertyOf(database);
  const firstDate = database.properties.find((p) => p.type === 'date');
  const today = todayKey();
  const done = records.filter((record) => isFinished(record, status)).length;
  const late = firstDate
    ? records.filter((record) => {
        const date = record.properties[firstDate.id];
        return typeof date === 'string' && date < today && !isFinished(record, status);
      }).length
    : 0;

  function aggregate(property: PropertyDef) {
    if (property.id === status?.id) {
      return (
        <>
          {t.footer.done} <b className="text-foreground font-medium">{done}</b>
          <span className="bg-well ml-2 inline-block h-1 w-14 overflow-hidden rounded-full align-middle">
            <span
              className="bg-primary block h-full rounded-full"
              style={{ width: `${(done / records.length) * 100}%` }}
            />
          </span>
        </>
      );
    }
    if (property.id === firstDate?.id) {
      return (
        <>
          {t.footer.late}{' '}
          <b className={late ? 'text-destructive font-medium' : 'text-foreground font-medium'}>
            {late}
          </b>
        </>
      );
    }
    return null;
  }

  return (
    <tfoot className="text-muted-foreground font-mono text-[11px]">
      <tr>
        <td className="h-9 px-2">
          {t.footer.count} <b className="text-foreground font-medium">{records.length}</b>
        </td>
        {columns.map((property) => (
          <td key={property.id} className="px-2 whitespace-nowrap">
            {aggregate(property)}
          </td>
        ))}
        <td />
      </tr>
    </tfoot>
  );
}
