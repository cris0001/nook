import { useMemo } from 'react';

import { BrandMark } from '@/components/brand';
import { todayKey } from '@/utils/dates';

import { useDashboard } from '../hooks/use-dashboard';
import { useDashboardsTranslation } from '../i18n';
import { computeMetrics } from '../utils/metrics';
import { DashboardCharts } from './dashboard-charts';
import { SourcePicker } from './source-picker';
import { StatTile } from './stat-tile';

export function DashboardView({ pageId, editable }: { pageId: string; editable: boolean }) {
  const t = useDashboardsTranslation();
  const state = useDashboard(pageId);
  const source = state.status === 'ready' ? state.source : null;
  const metrics = useMemo(
    () => (source ? computeMetrics(source.database, source.records, todayKey()) : null),
    [source],
  );

  if (state.status === 'loading') {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <SourcePicker
        dashboardId={pageId}
        sources={state.sources}
        current={source?.page ?? null}
        editable={editable}
      />
      {!metrics ? (
        <div className="flex items-center gap-4 py-8">
          <BrandMark eyesOnly mood="asleep" className="text-4xl" />
          <p className="text-muted-foreground max-w-sm text-sm">{t.empty}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="pr-6">
              <p className="text-[56px] leading-none font-semibold tracking-tight">
                {metrics.doneRatio === null ? '—' : `${Math.round(metrics.doneRatio * 100)}%`}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">{t.doneRatio}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              <StatTile label={t.total} value={metrics.total} />
              <StatTile label={t.open} value={metrics.open} />
              <StatTile label={t.overdue} value={metrics.overdue} alert />
              <StatTile label={t.dueThisWeek} value={metrics.dueThisWeek} />
              <StatTile label={t.doneThisWeek} value={metrics.doneThisWeek} />
            </div>
          </div>
          <DashboardCharts metrics={metrics} />
        </>
      )}
    </div>
  );
}
