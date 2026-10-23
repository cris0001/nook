import { addDays, format, startOfMonth, startOfWeek } from 'date-fns';

// Six full weeks covering `month` — a fixed 6×7 grid, so the picker never changes height
// between months. Days are 'YYYY-MM-DD' keys, matching how date cells store values.
export function monthGrid(month: Date, weekStartsOn: 0 | 1): string[] {
  const first = startOfWeek(startOfMonth(month), { weekStartsOn });
  return Array.from({ length: 42 }, (_, i) => format(addDays(first, i), 'yyyy-MM-dd'));
}
