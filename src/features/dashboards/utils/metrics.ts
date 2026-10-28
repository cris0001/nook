import { addDays, addWeeks, endOfDay, format, parseISO, startOfWeek } from 'date-fns';

import type { Database, SelectOption } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { statusPropertyOf } from '@/utils/progress';

export const WEEKS = 8;
export const BURNDOWN_DAYS = 14;

export interface Metrics {
  total: number;
  open: number;
  overdue: number;
  dueThisWeek: number;
  doneThisWeek: number;
  doneRatio: number | null;
  stages: { option: SelectOption; count: number }[];
  weekly: { week: string; done: number }[];
  burndown: { day: string; open: number }[];
}

export function computeMetrics(
  database: Database,
  records: readonly Page[],
  today: string,
): Metrics {
  const status = statusPropertyOf(database);
  const doneId = status?.options.at(-1)?.id;
  const dateId = database.properties.find((p) => p.type === 'date')?.id;
  const now = parseISO(today);
  const weekEnd = format(addDays(now, 6), 'yyyy-MM-dd');
  const finished = (r: Page) =>
    doneId !== undefined && status !== undefined && r.properties[status.id] === doneId;
  // Records finished before doneAt was tracked fall back to their last edit.
  const doneTime = (r: Page) => (finished(r) ? (r.doneAt ?? r.updatedAt) : null);

  let overdue = 0;
  let dueThisWeek = 0;
  for (const record of records) {
    const due = dateId ? record.properties[dateId] : null;
    if (typeof due !== 'string' || finished(record)) continue;
    if (due < today) overdue += 1;
    else if (due <= weekEnd) dueThisWeek += 1;
  }

  const thisWeek = startOfWeek(now, { weekStartsOn: 1 });
  const weekly = Array.from({ length: WEEKS }, (_, i) => {
    const start = addWeeks(thisWeek, i - WEEKS + 1);
    const from = start.getTime();
    const to = addWeeks(start, 1).getTime();
    const done = records.filter((r) => {
      const at = doneTime(r);
      return at !== null && at >= from && at < to;
    }).length;
    return { week: format(start, 'yyyy-MM-dd'), done };
  });

  const burndown = Array.from({ length: BURNDOWN_DAYS }, (_, i) => {
    const day = addDays(now, i - BURNDOWN_DAYS + 1);
    const cutoff = endOfDay(day).getTime();
    const open = records.filter((r) => {
      const at = doneTime(r);
      return r.createdAt <= cutoff && (at === null || at > cutoff);
    }).length;
    return { day: format(day, 'yyyy-MM-dd'), open };
  });

  const done = records.filter(finished).length;
  return {
    total: records.length,
    open: records.length - done,
    overdue,
    dueThisWeek,
    doneThisWeek: weekly.at(-1)?.done ?? 0,
    doneRatio: status && records.length ? done / records.length : null,
    stages: (status?.options ?? []).map((option) => ({
      option,
      count: records.filter((r) => r.properties[status?.id ?? ''] === option.id).length,
    })),
    weekly,
    burndown,
  };
}
