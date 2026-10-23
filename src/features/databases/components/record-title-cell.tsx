import { Link } from '@tanstack/react-router';
import { Maximize2 } from 'lucide-react';

import { renamePage } from '@/lib/data/pages';
import type { Page } from '@/schemas/page.schema';

import { useDatabasesTranslation } from '../i18n';

// The Name cell: the record's page title, editable in place, plus an "Open" button
// (on hover on desktop, always on touch) that opens the record as a full page.
export function RecordTitleCell({ record }: { record: Page }) {
  const t = useDatabasesTranslation();

  return (
    <div className="group/title flex h-full min-h-9 items-center">
      {record.icon ? <span className="pl-2">{record.icon}</span> : null}
      <input
        defaultValue={record.title}
        placeholder={t.untitled}
        onChange={(event) => void renamePage(record.id, event.target.value)}
        className="placeholder:text-muted-foreground/60 h-full min-h-9 min-w-0 flex-1 bg-transparent px-2 text-sm font-medium outline-none"
      />
      <Link
        to="/p/$pageId"
        params={{ pageId: record.id }}
        aria-label={t.open}
        title={t.open}
        className="text-muted-foreground hover:bg-hover hover:text-foreground mr-1 flex size-7 shrink-0 items-center justify-center rounded border lg:opacity-0 lg:group-hover/title:opacity-100 lg:focus-visible:opacity-100"
      >
        <Maximize2 className="size-3" />
      </Link>
    </div>
  );
}
