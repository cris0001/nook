import { addDays, format, parseISO } from 'date-fns';

import type { Database, SelectOption } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { statusPropertyOf } from '@/utils/progress';

// One database with everything the agenda needs from it.
export interface AgendaSource {
  page: Page;
  database: Database;
  records: Page[];
}

export interface AgendaItem {
  record: Page;
  source: Page;
  date: string;
  status: SelectOption | null;
  // What "check it off" means for this record: the status property and its last
  // option. Null when the database has no select to mark done with.
  complete: { propertyId: string; optionId: string } | null;
}

export interface Agenda {
  overdue: AgendaItem[];
  today: AgendaItem[];
  week: AgendaItem[];
  // Share of records (across databases with a status) sitting in their last option.
  doneRatio: number | null;
}

// Everything with a date that isn't finished, bucketed relative to `today`: before it,
// on it, and within the next six days. Each bucket is sorted by date, then title.
export function buildAgenda(sources: AgendaSource[], today: string): Agenda {
  const weekEnd = format(addDays(parseISO(today), 6), 'yyyy-MM-dd');
  const agenda: Agenda = { overdue: [], today: [], week: [], doneRatio: null };
  let tracked = 0;
  let done = 0;

  for (const { page, database, records } of sources) {
    const dateProperty = database.properties.find((p) => p.type === 'date');
    const status = statusPropertyOf(database);
    const last = status?.options.at(-1);

    for (const record of records) {
      const statusId = status ? record.properties[status.id] : null;
      const finished = last !== undefined && statusId === last.id;
      if (status) {
        tracked += 1;
        if (finished) done += 1;
      }

      const date = dateProperty ? record.properties[dateProperty.id] : null;
      if (typeof date !== 'string' || finished || date > weekEnd) {
        continue;
      }
      const item: AgendaItem = {
        record,
        source: page,
        date,
        status: status?.options.find((o) => o.id === statusId) ?? null,
        complete: status && last ? { propertyId: status.id, optionId: last.id } : null,
      };
      const bucket = date < today ? agenda.overdue : date === today ? agenda.today : agenda.week;
      bucket.push(item);
    }
  }

  const byDate = (a: AgendaItem, b: AgendaItem) =>
    a.date.localeCompare(b.date) || a.record.title.localeCompare(b.record.title);
  agenda.overdue.sort(byDate);
  agenda.today.sort(byDate);
  agenda.week.sort(byDate);
  agenda.doneRatio = tracked ? done / tracked : null;
  return agenda;
}
