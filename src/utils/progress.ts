import type { Database, PropertyDef } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

export interface Progress {
  done: number;
  total: number;
}

// The status of a database is its first select property; by convention its last option
// is the finished stage (To do → … → Done).
export function statusPropertyOf(database: Database): PropertyDef | undefined {
  return database.properties.find((p) => p.type === 'select');
}

// How many records sit in the finished stage, out of all records. Null when the
// database has no status to measure by, or nothing to measure yet.
export function progressOf(database: Database, records: Page[]): Progress | null {
  const status = statusPropertyOf(database);
  const last = status?.options.at(-1);
  if (!status || !last || records.length === 0) {
    return null;
  }
  const done = records.filter((record) => record.properties[status.id] === last.id).length;
  return { done, total: records.length };
}
