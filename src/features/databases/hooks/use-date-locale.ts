import { enGB, pl } from 'date-fns/locale';

import { useLocaleStore } from '@/stores/locale.store';

// date-fns locale + first weekday for the UI language. English uses the en-GB
// conventions (day before month, weeks from Monday) to match the "1 Oct 2026" style.
export function useDateLocale() {
  const locale = useLocaleStore((s) => s.locale);
  return { locale: locale === 'pl' ? pl : enGB, weekStartsOn: 1 as const };
}
