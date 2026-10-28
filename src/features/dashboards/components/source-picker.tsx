import { Check, ChevronDown, Database } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setDashboardSource } from '@/lib/data/dashboards';
import type { Page } from '@/schemas/page.schema';

import { useDashboardsTranslation } from '../i18n';

export function SourcePicker({
  dashboardId,
  sources,
  current,
  editable,
}: {
  dashboardId: string;
  sources: Page[];
  current: Page | null;
  editable: boolean;
}) {
  const t = useDashboardsTranslation();
  const name = current ? current.title || t.untitled : t.pickSource;

  return (
    <Popover>
      <PopoverTrigger
        disabled={!editable}
        className="enabled:hover:bg-hover flex h-8 items-center gap-2 self-start rounded-md border px-2.5 text-sm"
      >
        <span className="text-muted-foreground">{t.source}</span>
        {current?.icon ? <span>{current.icon}</span> : <Database className="size-4" />}
        <span className="font-medium">{name}</span>
        {editable ? <ChevronDown className="text-muted-foreground size-3.5" /> : null}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1">
        {sources.length === 0 ? (
          <p className="text-muted-foreground px-2 py-2 text-sm">{t.noSources}</p>
        ) : (
          sources.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => void setDashboardSource(dashboardId, page.id)}
              className="hover:bg-hover flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm lg:h-8"
            >
              {page.icon ? (
                <span className="w-4 text-center">{page.icon}</span>
              ) : (
                <Database className="size-4" />
              )}
              <span className="truncate">{page.title || t.untitled}</span>
              {page.id === current?.id ? (
                <Check className="text-primary-text ml-auto size-4" />
              ) : null}
            </button>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}
