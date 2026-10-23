import { format } from 'date-fns';
import { enGB, pl } from 'date-fns/locale';
import type { ReactNode } from 'react';

import { BrandMark } from '@/components/brand';
import { useCelebrateWhen } from '@/hooks/use-celebrate-when';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/stores/locale.store';

import { useAgenda } from '../hooks/use-agenda';
import { useTodayTranslation } from '../i18n';
import type { AgendaItem } from '../utils/agenda';
import { AgendaRow } from './agenda-row';
import { ProgressRing } from './progress-ring';

export function TodayView({ aside }: { aside?: ReactNode }) {
  const t = useTodayTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const state = useAgenda();
  const agenda = state.status === 'ready' ? state.agenda : null;
  useCelebrateWhen(
    agenda ? agenda.overdue.length + agenda.today.length + agenda.week.length === 0 : undefined,
  );

  if (state.status === 'loading') {
    return null;
  }

  const { overdue, today, week, doneRatio } = state.agenda;
  const open = overdue.length + today.length + week.length;
  const date = format(new Date(), 'EEEE, d MMMM', { locale: locale === 'pl' ? pl : enGB });
  const groups: [string, AgendaItem[], boolean][] = [
    [t.overdue, overdue, true],
    [t.today, today, false],
    [t.week, week, false],
  ];

  return (
    <div className="w-full px-4 pt-10 pb-16 sm:px-8 lg:px-12 lg:pt-12">
      <header className="border-divider flex flex-wrap items-end justify-between gap-6 border-b pb-7">
        <div>
          <p className="eyebrow">{t.kicker}</p>
          <h1 className="font-heading mt-2 text-[32px] leading-tight font-bold tracking-tight first-letter:uppercase [font-variation-settings:'opsz'_96] sm:text-[40px]">
            {date}
          </h1>
          <p className="text-muted-foreground mt-2 text-[15px]">
            {t.summary(open, overdue.length, today.length)}
          </p>
        </div>
        {doneRatio !== null ? <ProgressRing ratio={doneRatio} label={t.doneLabel} /> : null}
      </header>

      <div className="grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:gap-12">
        <section>
          {open === 0 ? (
            <div className="flex items-center gap-4 py-6">
              <BrandMark animated mood="asleep" className="text-4xl" />
              <div>
                <p className="font-medium">{t.emptyTitle}</p>
                <p className="text-muted-foreground mt-0.5 max-w-sm text-sm">
                  {state.databases ? t.emptyBody : t.noDatabases}
                </p>
              </div>
            </div>
          ) : (
            groups.map(([label, items, late]) =>
              items.length ? (
                <div key={label} className="mb-6">
                  <p
                    className={cn(
                      'flex h-7 items-center gap-2 text-xs font-semibold',
                      late && 'text-destructive',
                    )}
                  >
                    {label}
                    <span className="text-muted-foreground font-mono font-normal">
                      {items.length}
                    </span>
                  </p>
                  <ul className="border-divider border-t">
                    {items.map((item) => (
                      <AgendaRow key={item.record.id} item={item} late={late} />
                    ))}
                  </ul>
                </div>
              ) : null,
            )
          )}
        </section>
        {aside ? <aside>{aside}</aside> : null}
      </div>
    </div>
  );
}
