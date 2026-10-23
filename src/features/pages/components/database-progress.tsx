import { useCelebrateWhen } from '@/hooks/use-celebrate-when';
import { cn } from '@/lib/utils';

import { useDatabaseProgress } from '../hooks/use-database-progress';
import { usePagesTranslation } from '../i18n';

export function DatabaseProgress({
  databaseId,
  className,
}: {
  databaseId: string;
  className?: string;
}) {
  const t = usePagesTranslation();
  const progress = useDatabaseProgress(databaseId);
  useCelebrateWhen(progress === undefined ? undefined : progress?.done === progress?.total);
  if (!progress) {
    return null;
  }

  const percent = Math.round((progress.done / progress.total) * 100);
  const complete = progress.done === progress.total;

  return (
    <span
      title={t.progress(progress.done, progress.total)}
      className={cn(
        'text-muted-foreground flex shrink-0 items-center gap-1 font-mono text-[10.5px] tabular-nums',
        complete && 'text-primary-text',
        className,
      )}
    >
      <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 -rotate-90">
        <circle cx="8" cy="8" r="6" fill="none" strokeWidth="2.5" className="stroke-well" />
        {percent > 0 ? (
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${percent} 100`}
            className="stroke-primary"
          />
        ) : null}
      </svg>
      {percent}%
    </span>
  );
}
