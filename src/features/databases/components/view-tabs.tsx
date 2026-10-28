import { CalendarDays, ChevronDown, Kanban, Table2 } from 'lucide-react';

import { useCan } from '@/hooks/use-can';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { updateView } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import type { View, ViewType } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';

const VIEW_ICON: Record<ViewType, typeof Table2> = {
  table: Table2,
  board: Kanban,
  calendar: CalendarDays,
};

const TAB = 'flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium';

export function ViewTabs({
  views,
  activeId,
  onSelect,
}: {
  views: View[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const t = useDatabasesTranslation();
  const canConfigure = useCan('page.edit');

  return (
    <div className="flex min-w-0 items-center gap-1">
      <div
        role="tablist"
        aria-label={t.views}
        className="bg-well flex min-w-0 overflow-x-auto rounded-lg p-0.5"
      >
        {views.map((view) => {
          const Icon = VIEW_ICON[view.type];
          const label = view.name || t.viewType[view.type];
          if (view.id !== activeId || !canConfigure) {
            return (
              <button
                key={view.id}
                type="button"
                role="tab"
                aria-selected={view.id === activeId}
                onClick={() => onSelect(view.id)}
                className={cn(
                  TAB,
                  view.id === activeId
                    ? 'bg-background text-foreground shadow-raised'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            );
          }
          return (
            <Popover key={view.id}>
              <PopoverTrigger
                role="tab"
                aria-selected
                className={cn(TAB, 'bg-background text-foreground shadow-raised')}
              >
                <Icon className="size-4" />
                {label}
                <ChevronDown className="text-muted-foreground size-3.5" />
              </PopoverTrigger>
              <PopoverContent className="w-60 p-1">
                <input
                  autoFocus
                  defaultValue={view.name}
                  placeholder={t.viewType[view.type]}
                  aria-label={t.viewName}
                  onChange={(event) => void updateView(view.id, { name: event.target.value })}
                  className="h-9 w-full rounded-md border bg-transparent px-2 text-sm outline-none"
                />
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}
