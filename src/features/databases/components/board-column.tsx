import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';

import { addRecord } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import type { Database, PropertyDef, View } from '@/schemas/database.schema';

import type { BoardDropData } from '../hooks/use-board-dnd';
import { useDatabasesTranslation } from '../i18n';
import { useBoardUiStore } from '../stores/board-ui.store';
import { NO_GROUP, type BoardColumn as Column } from '../utils/board';
import { BoardCard } from './board-card';
import { BoardColumnMenu } from './board-column-menu';

// One board column: header with the option and a count, the cards, and "Add a card"
// which creates a record already in this column and puts its title in edit mode.
// The column's free space is a drop zone, so empty columns accept cards too.
export function BoardColumn({
  column,
  database,
  view,
  group,
}: {
  column: Column;
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

  async function addCard() {
    const value = column.key === NO_GROUP ? {} : { [group.id]: column.key };
    const record = await addRecord(database.id, value);
    setEditing(record.id);
  }

  return (
    <section
      ref={setNodeRef}
      className="bg-muted/60 flex w-[82vw] shrink-0 snap-start flex-col rounded-xl p-2 sm:w-auto sm:max-w-96 sm:min-w-48 sm:flex-1 sm:basis-0"
    >
      <header className="flex h-8 items-center gap-2 px-1">
        {column.option ? (
          <BoardColumnMenu databaseId={database.id} property={group} option={column.option} />
        ) : (
          <span className="text-muted-foreground text-xs font-medium">{t.noValue(group.name)}</span>
        )}
        <span className="text-muted-foreground text-xs tabular-nums">{column.records.length}</span>
        <button
          type="button"
          aria-label={t.addCard}
          title={t.addCard}
          onClick={() => void addCard()}
          className="text-muted-foreground hover:bg-hover ml-auto flex size-7 items-center justify-center rounded-md"
        >
          <Plus className="size-4" />
        </button>
      </header>

      <ul className="mt-1 flex min-h-12 flex-1 flex-col gap-2">
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

      <button
        type="button"
        onClick={() => void addCard()}
        className="text-muted-foreground hover:bg-hover hover:text-foreground mt-1 flex h-9 items-center gap-1.5 rounded-md px-1.5 text-sm"
      >
        <Plus className="size-4" />
        {t.addCard}
      </button>
    </section>
  );
}
