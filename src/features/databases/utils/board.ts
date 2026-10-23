import { generateKeyBetween } from 'fractional-indexing';

import type { PropertyDef, SelectOption } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

// Column key for records with no value in the grouping property.
export const NO_GROUP = '__none__';

export interface BoardColumn {
  key: string;
  option: SelectOption | null;
  records: Page[];
}

// Where a dragged card would land: a column, and the card it goes in front of
// (null = the end of the column).
export interface CardTarget {
  columnKey: string;
  beforeId: string | null;
}

function groupKeyOf(record: Page, property: PropertyDef): string {
  const value = record.properties[property.id];
  const id = Array.isArray(value) ? value[0] : value;
  return typeof id === 'string' && property.options.some((o) => o.id === id) ? id : NO_GROUP;
}

// Splits (already filtered and sorted) records into one column per option, in option
// order. The "no value" column leads, but only when something is actually in it.
export function groupRecords(records: Page[], property: PropertyDef): BoardColumn[] {
  const columns: BoardColumn[] = property.options.map((option) => ({
    key: option.id,
    option,
    records: [],
  }));
  const none: BoardColumn = { key: NO_GROUP, option: null, records: [] };
  const byKey = new Map(columns.map((column) => [column.key, column]));

  for (const record of records) {
    (byKey.get(groupKeyOf(record, property)) ?? none).records.push(record);
  }
  return none.records.length ? [none, ...columns] : columns;
}

// The fractional key for a card dropped at `target`, between its new neighbours. The
// dragged card itself is ignored when finding neighbours.
export function orderForDrop(column: BoardColumn, target: CardTarget, draggedId: string): string {
  const cards = column.records.filter((record) => record.id !== draggedId);
  const index = target.beforeId ? cards.findIndex((r) => r.id === target.beforeId) : -1;
  const next = index === -1 ? undefined : cards[index];
  const prev = index === -1 ? cards.at(-1) : cards[index - 1];
  return generateKeyBetween(prev?.order ?? null, next?.order ?? null);
}

// Today as 'YYYY-MM-DD' in local time — the same shape date cells store.
export function todayKey(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// A date in the past counts as overdue — unless the record sits in the last option of
// the grouping property, which by convention is the "Done" stage (To do → … → Done).
export function isOverdue(
  date: string,
  record: Page,
  group: PropertyDef | undefined,
  today = todayKey(),
): boolean {
  if (date >= today) {
    return false;
  }
  const last = group?.options.at(-1);
  return !(last && group && groupKeyOf(record, group) === last.id);
}
