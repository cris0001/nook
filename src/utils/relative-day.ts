import { differenceInCalendarDays, parseISO } from 'date-fns';

export type RelativeDay =
  | { kind: 'today' }
  | { kind: 'tomorrow' }
  | { kind: 'inDays'; days: number }
  | { kind: 'late'; days: number }
  | { kind: 'date' };

const SOON_DAYS = 6;

// `late` only for unfinished work — a finished task with a past date is just a date.
export function relativeDay(date: string, today: string, finished = false): RelativeDay {
  const days = differenceInCalendarDays(parseISO(date), parseISO(today));
  if (days === 0) return { kind: 'today' };
  if (days === 1) return { kind: 'tomorrow' };
  if (days > 1 && days <= SOON_DAYS) return { kind: 'inDays', days };
  if (days < 0 && !finished) return { kind: 'late', days: -days };
  return { kind: 'date' };
}
