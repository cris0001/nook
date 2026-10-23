import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DoneCircle } from '@/components/done-circle';
import { useCan } from '@/hooks/use-can';
import { useDueLabel } from '@/hooks/use-due-label';
import { setRecordValue } from '@/lib/data/databases';
import { cn } from '@/lib/utils';

import { useTodayTranslation } from '../i18n';
import type { AgendaItem } from '../utils/agenda';

const LEAVE_DELAY_MS = 650;

export function AgendaRow({ item }: { item: AgendaItem }) {
  const t = useTodayTranslation();
  const dueLabel = useDueLabel();
  const canEdit = useCan('record.edit');
  const [checked, setChecked] = useState(false);
  const { record, source, complete, status } = item;
  const title = record.title || t.untitled;
  const due = dueLabel(item.date);

  // The row stays a beat after the click so the check-off is seen, then the write
  // drops it from the agenda.
  useEffect(() => {
    if (!checked || !complete) return;
    const previous = record.properties[complete.propertyId] ?? null;
    const timer = window.setTimeout(() => {
      void setRecordValue(record.id, complete.propertyId, complete.optionId);
      toast(t.markedDone(title), {
        action: {
          label: t.undo,
          onClick: () => void setRecordValue(record.id, complete.propertyId, previous),
        },
      });
    }, LEAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [checked, complete, record, title, t]);

  return (
    <li
      className={cn(
        'border-divider flex h-11 items-center gap-3 border-b px-1 transition-opacity delay-300 duration-300 lg:h-10',
        checked && 'opacity-50',
      )}
    >
      <DoneCircle
        done={checked}
        label={t.markDone}
        disabled={!complete || !canEdit}
        onToggle={() => setChecked(true)}
      />
      <Link
        to="/p/$pageId"
        params={{ pageId: record.id }}
        className={cn(
          'min-w-0 flex-1 truncate font-medium decoration-2 hover:underline',
          checked && 'text-muted-foreground decoration-primary line-through hover:line-through',
        )}
      >
        {record.icon ? `${record.icon} ` : ''}
        {title}
      </Link>
      <Link
        to="/p/$pageId"
        params={{ pageId: source.id }}
        className="text-muted-foreground hover:text-foreground hidden w-40 items-center gap-1.5 truncate text-[12.5px] sm:flex"
      >
        <i
          aria-hidden
          className="size-[7px] shrink-0 rounded-full"
          style={{ background: `var(--dot-${status?.color ?? 'gray'})` }}
        />
        <span className="truncate">{source.title || t.untitled}</span>
      </Link>
      <span
        className={cn(
          'w-32 shrink-0 text-right font-mono text-[11.5px] whitespace-nowrap',
          due.tone === 'late' && 'text-destructive font-medium',
          due.tone === 'today' && 'text-primary-text font-semibold',
          due.tone === 'plain' && 'text-muted-foreground',
        )}
      >
        {due.text}
      </span>
    </li>
  );
}
