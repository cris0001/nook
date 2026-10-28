import { format, parseISO } from 'date-fns';
import type { ReactNode } from 'react';

import { useDateLocale } from '@/hooks/use-date-locale';

import { useDashboardsTranslation } from '../i18n';
import type { Metrics } from '../utils/metrics';
import { ColumnChart } from './column-chart';
import { LineChart } from './line-chart';
import { StatusBars } from './status-bars';

function Panel({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="border-divider min-w-0 rounded-xl border p-4 sm:p-5">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-muted-foreground mb-4 text-xs">{note}</p>
      {children}
    </section>
  );
}

export function DashboardCharts({ metrics }: { metrics: Metrics }) {
  const t = useDashboardsTranslation();
  const { locale } = useDateLocale();
  const short = (day: string) => format(parseISO(day), 'd MMM', { locale });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title={t.burndown} note={t.burndownNote}>
        <LineChart
          label={t.burndown}
          points={metrics.burndown.map(({ day, open }) => ({
            key: day,
            label: short(day),
            value: open,
            tooltip: t.openOn(short(day), open),
          }))}
        />
      </Panel>
      <Panel title={t.weekly} note={t.weeklyNote}>
        <ColumnChart
          label={t.weekly}
          points={metrics.weekly.map(({ week, done }) => ({
            key: week,
            label: short(week),
            value: done,
            tooltip: t.doneInWeek(short(week), done),
          }))}
        />
      </Panel>
      <div className="lg:col-span-2">
        <Panel title={t.byStatus} note={t.byStatusNote}>
          <StatusBars stages={metrics.stages} total={metrics.total} />
        </Panel>
      </div>
    </div>
  );
}
