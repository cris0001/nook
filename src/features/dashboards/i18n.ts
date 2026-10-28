import { createTranslation } from '@/lib/i18n/create-translation';
import { polishPlural } from '@/lib/i18n/plural';

const en = {
  untitled: 'Untitled',
  source: 'Data from',
  pickSource: 'Pick a database',
  noSources: 'Create a database first — its records feed this dashboard.',
  empty: 'Pick a database above to chart its records.',
  doneRatio: 'of records done',
  total: 'Records',
  open: 'Open',
  overdue: 'Overdue',
  dueThisWeek: 'Due this week',
  doneThisWeek: 'Done this week',
  burndown: 'Burndown',
  burndownNote: 'Open records at the end of each day, last 14 days',
  weekly: 'Completed per week',
  weeklyNote: 'Records moved to the done stage, last 8 weeks',
  byStatus: 'By status',
  byStatusNote: 'Where every record sits right now',
  openOn: (day: string, n: number) => `${day}: ${n} open`,
  doneInWeek: (week: string, n: number) => `Week of ${week}: ${n} done`,
};

const pl: typeof en = {
  untitled: 'Bez tytułu',
  source: 'Dane z',
  pickSource: 'Wybierz bazę',
  noSources: 'Najpierw utwórz bazę danych — jej rekordy zasilają ten dashboard.',
  empty: 'Wybierz bazę powyżej, żeby zobaczyć wykresy jej rekordów.',
  doneRatio: 'rekordów zrobionych',
  total: 'Rekordy',
  open: 'Otwarte',
  overdue: 'Po terminie',
  dueThisWeek: 'Na ten tydzień',
  doneThisWeek: 'Zrobione w tym tygodniu',
  burndown: 'Burndown',
  burndownNote: 'Otwarte rekordy na koniec każdego dnia, ostatnie 14 dni',
  weekly: 'Zrobione w tygodniu',
  weeklyNote: 'Rekordy przeniesione do ostatniego statusu, ostatnie 8 tygodni',
  byStatus: 'Według statusu',
  byStatusNote: 'Gdzie teraz jest każdy rekord',
  openOn: (day, n) => `${day}: ${n} otwartych`,
  doneInWeek: (week, n) =>
    `Tydzień od ${week}: ${n} ${polishPlural(n, 'zrobiony', 'zrobione', 'zrobionych')}`,
};

export const useDashboardsTranslation = createTranslation({ en, pl });
