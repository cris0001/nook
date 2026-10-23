import { addDays, format, startOfMonth, startOfWeek } from 'date-fns';

export function monthGrid(month: Date, weekStartsOn: 0 | 1): string[] {
  const first = startOfWeek(startOfMonth(month), { weekStartsOn });
  return Array.from({ length: 42 }, (_, i) => format(addDays(first, i), 'yyyy-MM-dd'));
}
