import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';

import { useCan } from '@/hooks/use-can';
import { BrandMark } from '@/components/brand';
import { addRecord } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import type { Database, PropertyDef, View } from '@/schemas/database.schema';

import type { BoardDropData } from '../hooks/use-board-dnd';
import { useDatabasesTranslation } from '../i18n';
import { useBoardUiStore } from '../stores/board-ui.store';
import { NO_GROUP, type BoardColumn as Column } from '../utils/board';
import { DOT_STYLE } from '../utils/option-style';
import { BoardCard } from './board-card';
import { BoardColumnMenu } from './board-column-menu';

export function BoardColumn({
  column,
  database,
  view,
  group,
  total,
}: {
  column: Column;
  total: number;
  database: Database;
  view: View;
  group: PropertyDef;
}) {
  const t = useDatabasesTranslation();
  const data: BoardDropData = { kind: 'column', columnKey: column.key };
  const { setNodeRef } = useDroppable({ id: `column:${column.key}`, data });
  const lineAtEnd = useBoardUiStore(
    (s) => s.target?.columnKey === column.key && s.target.beforeId === null,
  );
  const setEditing = useBoardUiStore((s) => s.setEditing);
  const canAdd = useCan('record.edit');

  async function addCard() {
    const value = column.key === NO_GROUP ? {} : { [group.id]: column.key };
    const record = await addRecord(database.id, value);
    setEditing(record.id);
  }

  return (
    <section
      ref={setNodeRef}
      className="bg-surface flex w-[82vw] shrink-0 snap-start flex-col rounded-xl p-2 sm:w-auto sm:max-w-96 sm:min-w-48 sm:flex-1 sm:basis-0"
    >
      <header className="flex h-8 items-center gap-2 pr-0.5 pl-1.5">
        {column.option ? (
          <BoardColumnMenu databaseId={database.id} property={group} option={column.option} />
        ) : (
          <span className="flex items-center gap-2 text-[13px] font-semibold">
            <i aria-hidden className="size-[7px] rounded-full bg-(--dot-gray)" />
            {t.noValue(group.name)}
          </span>
        )}
        <span className="text-muted-foreground font-mono text-[11.5px] tabular-nums">
          {column.records.length}
        </span>
        {canAdd ? (
          <button
            type="button"
            aria-label={t.addCard}
            title={t.addCard}
            onClick={() => void addCard()}
            className="text-muted-foreground hover:bg-hover ml-auto flex size-7 items-center justify-center rounded-md"
          >
            <Plus className="size-4" />
          </button>
        ) : null}
      </header>
      <div aria-hidden className="bg-well mx-1.5 mt-0.5 h-0.5 overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300',
            DOT_STYLE[column.option?.color ?? 'gray'],
          )}
          style={{ width: `${total ? (column.records.length / total) * 100 : 0}%` }}
        />
      </div>

      <ul className="mt-2 flex min-h-12 flex-1 flex-col gap-2">
        {column.records.length === 0 && !lineAtEnd ? (
          <li className="text-muted-foreground flex min-h-36 flex-1 flex-col items-center justify-center gap-2.5 rounded-[9px] border-[1.5px] border-dashed text-[12.5px]">
            <BrandMark eyesOnly mood="asleep" className="text-[34px]" />
            {canAdd ? t.emptyColumn : t.emptyColumnReadOnly}
          </li>
        ) : null}
        {column.records.map((record) => (
          <BoardCard
            key={record.id}
            record={record}
            columnKey={column.key}
            database={database}
            view={view}
            group={group}
          />
        ))}
        <li
          aria-hidden
          className={cn('bg-primary h-0.5 rounded-full', !lineAtEnd && 'invisible')}
        />
      </ul>

      {canAdd ? (
        <button
          type="button"
          onClick={() => void addCard()}
          className="text-muted-foreground hover:bg-hover hover:text-foreground mt-1 flex h-9 items-center gap-1.5 rounded-md px-1.5 text-sm"
        >
          <Plus className="size-4" />
          {t.addCard}
        </button>
      ) : null}
    </section>
  );
}
