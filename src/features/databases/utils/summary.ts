import { addDays, format, parseISO } from 'date-fns';

import type { Database, SelectOption } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { statusPropertyOf } from '@/utils/progress';

export interface DatabaseSummary {
  total: number;
  overdue: number;
  dueThisWeek: number;
  stages: { option: SelectOption; count: number }[];
  doneRatio: number | null;
}

export function summarize(database: Database, records: Page[], today: string): DatabaseSummary {
  const status = statusPropertyOf(database);
  const dateProperty = database.properties.find((p) => p.type === 'date');
  const last = status?.options.at(-1);
  const weekEnd = format(addDays(parseISO(today), 6), 'yyyy-MM-dd');

  const counts = new Map<string, number>();
  let overdue = 0;
  let dueThisWeek = 0;

  for (const record of records) {
    const stage = status ? record.properties[status.id] : null;
    if (typeof stage === 'string') counts.set(stage, (counts.get(stage) ?? 0) + 1);
    const finished = last !== undefined && stage === last.id;
    const date = dateProperty ? record.properties[dateProperty.id] : null;
    if (typeof date !== 'string' || finished) continue;
    if (date < today) overdue += 1;
    else if (date <= weekEnd) dueThisWeek += 1;
  }

  const stages = (status?.options ?? []).map((option) => ({
    option,
    count: counts.get(option.id) ?? 0,
  }));
  const done = last ? (counts.get(last.id) ?? 0) : 0;

  return {
    total: records.length,
    overdue,
    dueThisWeek,
    stages,
    doneRatio: status && records.length ? done / records.length : null,
  };
}
