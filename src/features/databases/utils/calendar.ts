import { addDays, format, startOfWeek } from 'date-fns';

import type { Database, PropertyDef, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

export type CalendarMode = 'month' | 'week';

export function weekDays(anchor: Date, weekStartsOn: 0 | 1): string[] {
  const first = startOfWeek(anchor, { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => format(addDays(first, i), 'yyyy-MM-dd'));
}

export function calendarDateProperty(database: Database, view: View): PropertyDef | undefined {
  const dates = database.properties.filter((p) => p.type === 'date');
  return dates.find((p) => p.id === view.dateProperty) ?? dates[0];
}

export function recordsByDay(records: readonly Page[], dateId: string): Map<string, Page[]> {
  const days = new Map<string, Page[]>();
  for (const record of records) {
    const day = record.properties[dateId];
    if (typeof day !== 'string') continue;
    const list = days.get(day);
    if (list) list.push(record);
    else days.set(day, [record]);
  }
  return days;
}
