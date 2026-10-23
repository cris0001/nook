import { CalendarDays, ChevronDown, Kanban, Plus, Table2, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addView, deleteView, updateView } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import type { View, ViewType } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';

const VIEW_ICON: Record<ViewType, typeof Table2> = {
  table: Table2,
  board: Kanban,
  calendar: CalendarDays,
};

// View types offered by "+" (calendar arrives with its own stage).
const ADDABLE: ViewType[] = ['table', 'board'];

const TAB = 'flex h-10 shrink-0 items-center gap-1.5 border-b-2 px-2 text-sm';

// Tabs across the top of a database. Clicking the open tab again opens its settings
// (rename, delete); "+" adds a new table or board view and switches to it.
export function ViewTabs({
  databaseId,
  views,
  activeId,
  onSelect,
}: {
  databaseId: string;
  views: View[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const t = useDatabasesTranslation();

  async function add(type: ViewType) {
    const view = await addView(databaseId, type, '');
    onSelect(view.id);
  }

  return (
    <div
      role="tablist"
      aria-label={t.views}
      className="-mb-px flex min-w-0 items-center overflow-x-auto"
    >
      {views.map((view) => {
        const Icon = VIEW_ICON[view.type];
        const label = view.name || t.viewType[view.type];
        if (view.id !== activeId) {
          return (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={false}
              onClick={() => onSelect(view.id)}
              className={cn(TAB, 'text-muted-foreground hover:text-foreground border-transparent')}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        }
        return (
          <Popover key={view.id}>
            <PopoverTrigger role="tab" aria-selected className={cn(TAB, 'border-foreground')}>
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
                className="mb-1 h-9 w-full rounded-md border bg-transparent px-2 text-sm outline-none"
              />
              {views.length > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const next = views.find((v) => v.id !== view.id);
                    void deleteView(view.id);
                    if (next) onSelect(next.id);
                  }}
                  className="text-destructive hover:bg-hover flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm lg:h-8"
                >
                  <Trash2 className="size-4" />
                  {t.deleteView}
                </button>
              ) : null}
            </PopoverContent>
          </Popover>
        );
      })}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t.addView}
          title={t.addView}
          className="text-muted-foreground hover:bg-hover hover:text-foreground ml-1 flex size-7 shrink-0 items-center justify-center rounded-md"
        >
          <Plus className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {ADDABLE.map((type) => {
            const Icon = VIEW_ICON[type];
            return (
              <DropdownMenuItem key={type} onSelect={() => void add(type)}>
                <Icon />
                {t.viewType[type]}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
