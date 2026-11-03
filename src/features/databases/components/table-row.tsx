import { memo } from 'react';

import type { PropertyDef } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import { isFinished } from '../utils/board';
import { PropertyCell } from './property-cell';
import { RecordTitleCell } from './record-title-cell';

interface TableRowProps {
  databaseId: string;
  record: Page;
  columns: PropertyDef[];
  status: PropertyDef | undefined;
}

// Live queries hand back fresh row objects on every change, so a plain memo would never
// hit; an unchanged `updatedAt` means an unchanged record.
function same(prev: TableRowProps, next: TableRowProps) {
  return (
    prev.record.id === next.record.id &&
    prev.record.updatedAt === next.record.updatedAt &&
    prev.columns === next.columns &&
    prev.status === next.status &&
    prev.databaseId === next.databaseId
  );
}

export const TableRow = memo(function TableRow({
  databaseId,
  record,
  columns,
  status,
}: TableRowProps) {
  return (
    <tr className="group/row hover:bg-hover/50 border-divider border-b">
      <td className="p-0 group-hover/row:shadow-[inset_2.5px_0_0_var(--color-primary)]">
        <RecordTitleCell record={record} />
      </td>
      {columns.map((property) => (
        <td key={property.id} className="border-divider border-l p-0 align-middle">
          <PropertyCell
            databaseId={databaseId}
            recordId={record.id}
            property={property}
            value={record.properties[property.id] ?? null}
            finished={isFinished(record, status)}
          />
        </td>
      ))}
      <td className="border-divider border-l" />
    </tr>
  );
}, same);
