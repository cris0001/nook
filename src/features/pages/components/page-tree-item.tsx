import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Link } from '@tanstack/react-router';
import { ChevronRight, Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { renamePage } from '@/lib/data/pages';
import { usePermissions } from '@/hooks/use-can';
import { cn } from '@/lib/utils';

import { useCreatePage } from '../hooks/use-create-page';
import { usePagesTranslation } from '../i18n';
import { useSidebarUiStore } from '../stores/sidebar-ui.store';
import { PAGE_TYPE_ICON } from '../utils/page-icon';
import { ACTIVE_WITHIN, SIDEBAR_ROW } from '../utils/row-styles';
import type { PageNode } from '../utils/page-tree';
import { DatabaseProgress } from './database-progress';
import { PageActionsMenu } from './page-actions-menu';

const INDENT_PX = 14;

// One row of the sidebar tree, plus its children when expanded. Indentation grows with
// depth; the expand chevron, the actions menu and the "add inside" button sit on the
// row so they're one tap away. Rows are taller on touch screens (h-10) than on
// desktop (h-8). On desktop the row buttons take the place of the progress ring on
// hover or focus, so idle rows give the title the full width. Each row is both
// draggable and a drop target; the drop indicator (a line above/below, or a tint for
// "inside") comes from the sidebar UI store.
export function PageTreeItem({ node, depth }: { node: PageNode; depth: number }) {
  const t = usePagesTranslation();
  const createPage = useCreatePage();
  const { page, children } = node;
  const expanded = useSidebarUiStore((s) => s.expanded.includes(page.id));
  const toggle = useSidebarUiStore((s) => s.toggle);
  const expand = useSidebarUiStore((s) => s.expand);
  const renaming = useSidebarUiStore((s) => s.renamingId === page.id);
  const setRenaming = useSidebarUiStore((s) => s.setRenaming);
  const renameInput = useRef<HTMLInputElement>(null);
  const allowed = usePermissions();
  const canEdit = allowed('page.edit');

  // Focus after the frame in which a menu (if that's where Rename came from) closes —
  // an autoFocus would lose focus to the closing menu. The hidden mobile copy of the
  // sidebar is inert, so only the visible input actually takes focus.
  useEffect(() => {
    if (!renaming) return;
    const frame = requestAnimationFrame(() => renameInput.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [renaming]);
  const drop = useSidebarUiStore((s) =>
    s.dropTarget?.id === page.id ? s.dropTarget.position : null,
  );
  const drag = useDraggable({ id: page.id, disabled: !canEdit });
  const { setNodeRef: setDropRef } = useDroppable({ id: page.id });
  const Icon = PAGE_TYPE_ICON[page.type];
  const indent = depth * INDENT_PX + 4;

  function finishRename(value: string) {
    setRenaming(null);
    if (value !== page.title) {
      void renamePage(page.id, value.trim());
    }
  }

  async function addInside() {
    expand(page.id);
    await createPage({ parentId: page.id, type: 'document' });
  }

  return (
    <li>
      <div
        ref={(element) => {
          drag.setNodeRef(element);
          setDropRef(element);
        }}
        {...drag.listeners}
        className={cn(
          SIDEBAR_ROW,
          ACTIVE_WITHIN,
          'group/row gap-1 pr-1',
          drag.isDragging && 'opacity-40',
          drop === 'inside' && 'bg-primary-tint ring-primary ring-1 ring-inset',
        )}
        style={{ paddingLeft: `${indent}px` }}
      >
        {drop === 'before' || drop === 'after' ? (
          <span
            aria-hidden
            className={cn(
              'bg-primary pointer-events-none absolute right-1 h-0.5 rounded-full',
              drop === 'before' ? '-top-px' : '-bottom-px',
            )}
            style={{ left: `${indent}px` }}
          />
        ) : null}

        <button
          type="button"
          aria-label={expanded ? t.collapse : t.expand}
          aria-expanded={expanded}
          onClick={() => toggle(page.id)}
          className={cn(
            'text-muted-foreground hover:bg-hover flex size-6 shrink-0 items-center justify-center rounded',
            children.length === 0 && 'invisible',
          )}
        >
          <ChevronRight className={cn('size-3.5 transition-transform', expanded && 'rotate-90')} />
        </button>

        {renaming ? (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {page.icon ? (
              <span className="w-4 shrink-0 text-center">{page.icon}</span>
            ) : (
              <Icon className="size-4 shrink-0" />
            )}
            <input
              ref={renameInput}
              defaultValue={page.title}
              placeholder={t.untitled}
              aria-label={t.actions.rename}
              onFocus={(event) => event.currentTarget.select()}
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onBlur={(event) => finishRename(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur();
                if (event.key === 'Escape') {
                  event.currentTarget.value = page.title;
                  event.currentTarget.blur();
                }
              }}
              className="text-foreground ring-primary min-w-0 flex-1 rounded-sm bg-transparent px-1 outline-none focus:ring-1"
            />
          </span>
        ) : (
          <Link
            to="/p/$pageId"
            params={{ pageId: page.id }}
            onDoubleClick={(event) => {
              if (!canEdit) return;
              event.preventDefault();
              setRenaming(page.id);
            }}
            draggable={false}
            className="data-[status=active]:text-foreground flex min-w-0 flex-1 items-center gap-2 data-[status=active]:font-medium"
          >
            {page.icon ? (
              <span className="w-4 shrink-0 text-center">{page.icon}</span>
            ) : (
              <Icon className="size-4 shrink-0" />
            )}
            <span className="truncate">{page.title || t.untitled}</span>
          </Link>
        )}

        {page.type === 'database' && !renaming ? (
          <DatabaseProgress
            databaseId={page.id}
            className="mr-1.5 lg:group-has-focus-visible/row:hidden lg:group-hover/row:hidden"
          />
        ) : null}

        <PageActionsMenu
          pageId={page.id}
          renamable
          className="lg:hidden lg:group-has-focus-visible/row:flex lg:group-hover/row:flex lg:data-[state=open]:flex"
        />
        {allowed('page.create') ? (
          <button
            type="button"
            aria-label={t.addSubpage}
            title={t.addSubpage}
            onClick={() => void addInside()}
            className="text-muted-foreground hover:bg-hover flex size-6 shrink-0 items-center justify-center rounded lg:hidden lg:group-has-focus-visible/row:flex lg:group-hover/row:flex"
          >
            <Plus className="size-3.5" />
          </button>
        ) : null}
      </div>

      {expanded && children.length > 0 ? (
        <ul>
          {children.map((child) => (
            <PageTreeItem key={child.page.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
