import { generateKeyBetween } from 'fractional-indexing';

import type { PropertyDef, SelectOption } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { todayKey } from '@/utils/dates';

export const NO_GROUP = '__none__';

export interface BoardColumn {
  key: string;
  option: SelectOption | null;
  records: Page[];
}

export interface CardTarget {
  columnKey: string;
  beforeId: string | null;
}

function groupKeyOf(record: Page, property: PropertyDef): string {
  const value = record.properties[property.id];
  const id = Array.isArray(value) ? value[0] : value;
  return typeof id === 'string' && property.options.some((o) => o.id === id) ? id : NO_GROUP;
}

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

export function orderForDrop(column: BoardColumn, target: CardTarget, draggedId: string): string {
  const cards = column.records.filter((record) => record.id !== draggedId);
  const index = target.beforeId ? cards.findIndex((r) => r.id === target.beforeId) : -1;
  const next = index === -1 ? undefined : cards[index];
  const prev = index === -1 ? cards.at(-1) : cards[index - 1];
  return generateKeyBetween(prev?.order ?? null, next?.order ?? null);
}

// By convention the last option of the grouping property is the "Done" stage.
export function isFinished(record: Page, group: PropertyDef | undefined): boolean {
  const last = group?.options.at(-1);
  return Boolean(last && group && groupKeyOf(record, group) === last.id);
}

export function isOverdue(
  date: string,
  record: Page,
  group: PropertyDef | undefined,
  today = todayKey(),
): boolean {
  return date < today && !isFinished(record, group);
}
