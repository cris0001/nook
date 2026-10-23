import { cn } from '@/lib/utils';
import type { Database } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { todayKey } from '@/utils/dates';

import { useDatabasesTranslation } from '../i18n';
import { DOT_STYLE } from '../utils/option-style';
import { summarize } from '../utils/summary';

export function DatabaseSummary({ database, records }: { database: Database; records: Page[] }) {
  const t = useDatabasesTranslation();
  const summary = summarize(database, records, todayKey());
  if (summary.total === 0) {
    return null;
  }

  const unstaged = summary.total - summary.stages.reduce((sum, s) => sum + s.count, 0);
  const facts = [
    <span key="total">{t.summary.records(summary.total)}</span>,
    summary.overdue ? (
      <span key="overdue" className="text-destructive font-medium">
        {t.summary.overdue(summary.overdue)}
      </span>
    ) : null,
    summary.dueThisWeek ? <span key="week">{t.summary.thisWeek(summary.dueThisWeek)}</span> : null,
    summary.doneRatio !== null ? (
      <span key="done">
        <span className="text-primary-text font-mono font-semibold">
          {Math.round(summary.doneRatio * 100)}%
        </span>{' '}
        {t.summary.done}
      </span>
    ) : null,
  ].filter(Boolean);

  return (
    <div className="mt-3">
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13.5px]">
        {facts.flatMap((fact, i) =>
          i === 0
            ? [fact]
            : [
                <span key={`sep-${i}`} aria-hidden>
                  ·
                </span>,
                fact,
              ],
        )}
      </p>
      {summary.stages.length ? (
        <>
          <div className="mt-3.5 flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden>
            {summary.stages.map(({ option, count }) =>
              count ? (
                <span
                  key={option.id}
                  className={cn(
                    'rounded-full transition-[flex-grow] duration-300',
                    DOT_STYLE[option.color],
                  )}
                  style={{ flexGrow: count }}
                />
              ) : null,
            )}
            {unstaged ? (
              <span className="bg-well rounded-full" style={{ flexGrow: unstaged }} />
            ) : null}
          </div>
          <ul className="text-muted-foreground mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {summary.stages.map(({ option, count }) => (
              <li key={option.id} className="flex items-center gap-1.5">
                <i aria-hidden className={cn('size-[7px] rounded-full', DOT_STYLE[option.color])} />
                {option.name}
                <span className="font-mono tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
