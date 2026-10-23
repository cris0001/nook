import { Link } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { enGB, pl } from 'date-fns/locale';
import { TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { setRecordValue } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/stores/locale.store';

import { useTodayTranslation } from '../i18n';
import type { AgendaItem } from '../utils/agenda';

// A task in the agenda: a round checkbox that moves it to its database's last status
// (with Undo), the title linking to the record, where it lives, and the due date.
export function AgendaRow({ item, late }: { item: AgendaItem; late: boolean }) {
  const t = useTodayTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const { record, source, complete, status } = item;
  const title = record.title || t.untitled;

  function markDone() {
    if (!complete) return;
    const previous = record.properties[complete.propertyId] ?? null;
    void setRecordValue(record.id, complete.propertyId, complete.optionId);
    toast(t.markedDone(title), {
      action: {
        label: t.undo,
        onClick: () => void setRecordValue(record.id, complete.propertyId, previous),
      },
    });
  }

  const due =
    item.date === format(new Date(), 'yyyy-MM-dd')
      ? t.dueToday
      : format(parseISO(item.date), 'EEE d MMM', { locale: locale === 'pl' ? pl : enGB });

  return (
    <li className="border-divider flex h-11 items-center gap-3 border-b px-1 lg:h-10">
      <button
        type="button"
        aria-label={t.markDone}
        title={t.markDone}
        disabled={!complete}
        onClick={markDone}
        className="border-muted-foreground/60 hover:border-primary hover:bg-primary-tint size-4 shrink-0 rounded-full border-[1.5px] transition-colors disabled:opacity-30"
      />
      <Link
        to="/p/$pageId"
        params={{ pageId: record.id }}
        className="min-w-0 flex-1 truncate font-medium hover:underline"
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
          'flex w-24 shrink-0 items-center justify-end gap-1 font-mono text-[11.5px]',
          late ? 'text-destructive font-medium' : 'text-muted-foreground',
        )}
      >
        {late ? <TriangleAlert className="size-3" /> : null}
        {due}
      </span>
    </li>
  );
}
