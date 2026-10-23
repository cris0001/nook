import { createTranslation } from '@/lib/i18n/create-translation';

// Polish plural for "task": 1 zadanie, 2–4 zadania, 5+ (and 12–14) zadań.
function zadan(n: number): string {
  if (n === 1) return 'zadanie';
  const tens = n % 100;
  const ones = n % 10;
  return ones >= 2 && ones <= 4 && (tens < 12 || tens > 14) ? 'zadania' : 'zadań';
}

// Today feature copy.
const en = {
  kicker: 'Today',
  overdue: 'Overdue',
  today: 'Today',
  week: 'This week',
  summary: (open: number, overdue: number, today: number) => {
    if (!open) return 'Nothing due this week.';
    const parts = [
      overdue ? `${overdue} overdue` : null,
      today ? `${today} due today` : null,
    ].filter(Boolean);
    return `${open} open ${open === 1 ? 'task' : 'tasks'} this week${parts.length ? ' — ' + parts.join(', ') : ''}.`;
  },
  doneLabel: 'done overall',
  markDone: 'Mark as done',
  markedDone: (title: string) => `"${title}" done`,
  undo: 'Undo',
  untitled: 'Untitled',
  dueToday: 'Today',
  emptyTitle: 'All clear',
  emptyBody: 'Nothing with a date this week. Give tasks a date in a database to see them here.',
  noDatabases: 'Create a database and give its records a date — they show up here by day.',
};

const pl: typeof en = {
  kicker: 'Dziś',
  overdue: 'Zaległe',
  today: 'Dziś',
  week: 'Ten tydzień',
  summary: (open, overdue, today) => {
    if (!open) return 'Nic na ten tydzień.';
    const parts = [overdue ? `${overdue} zaległe` : null, today ? `${today} na dziś` : null].filter(
      Boolean,
    );
    return `${open} ${zadan(open)} w tym tygodniu${parts.length ? ' — ' + parts.join(', ') : ''}.`;
  },
  doneLabel: 'zrobione łącznie',
  markDone: 'Oznacz jako zrobione',
  markedDone: (title) => `„${title}” zrobione`,
  undo: 'Cofnij',
  untitled: 'Bez tytułu',
  dueToday: 'Dziś',
  emptyTitle: 'Wszystko czyste',
  emptyBody: 'Nic z datą w tym tygodniu. Nadaj zadaniom datę w bazie, a pojawią się tutaj.',
  noDatabases: 'Utwórz bazę danych i nadaj rekordom daty — pojawią się tu, dzień po dniu.',
};

export const useTodayTranslation = createTranslation({ en, pl });
