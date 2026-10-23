import { format, parseISO } from 'date-fns';

import { useDateLocale } from '@/hooks/use-date-locale';
import { useCommonTranslation } from '@/lib/i18n/common';
import { todayKey } from '@/utils/dates';
import { relativeDay } from '@/utils/relative-day';

export type DueTone = 'late' | 'today' | 'plain';

export interface DueLabel {
  text: string;
  tone: DueTone;
}

export function useDueLabel(): (date: string, finished?: boolean) => DueLabel {
  const t = useCommonTranslation();
  const { locale } = useDateLocale();
  const today = todayKey();

  return (date, finished = false) => {
    const day = relativeDay(date, today, finished);
    switch (day.kind) {
      case 'today':
        return { text: t.due.today, tone: 'today' };
      case 'tomorrow':
        return { text: t.due.tomorrow, tone: 'plain' };
      case 'inDays':
        return { text: t.due.inDays(day.days), tone: 'plain' };
      case 'late':
        return { text: t.due.late(day.days), tone: 'late' };
      case 'date': {
        const pattern = date.slice(0, 4) === today.slice(0, 4) ? 'EEE d MMM' : 'd MMM yyyy';
        return { text: format(parseISO(date), pattern, { locale }), tone: 'plain' };
      }
    }
  };
}
