import { enGB, pl } from 'date-fns/locale';

import { useLocaleStore } from '@/stores/locale.store';

export function useDateLocale() {
  const locale = useLocaleStore((s) => s.locale);
  return { locale: locale === 'pl' ? pl : enGB, weekStartsOn: 1 as const };
}
