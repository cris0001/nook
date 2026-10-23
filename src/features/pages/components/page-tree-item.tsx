import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Link } from '@tanstack/react-router';
import { ChevronRight, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useCreatePage } from '../hooks/use-create-page';
import { usePagesTranslation } from '../i18n';
import { useSidebarUiStore } from '../stores/sidebar-ui.store';
import { PAGE_TYPE_ICON } from '../utils/page-icon';
import type { PageNode } from '../utils/page-tree';
import { PageActionsMenu } from './page-actions-menu';

const INDENT_PX = 14;

// One row of the sidebar tree, plus its children when expanded. Indentation grows with
// depth; the expand chevron, the actions menu and the "add inside" button sit on the
// row so they're one tap away. Rows are taller on touch screens (h-10) than on
// desktop (h-8). Each row is both draggable and a drop target; the drop indicator
// (a line above/below, or a tint for "inside") comes from the sidebar UI store.
export function PageTreeItem({ node, depth }: { node: PageNode; depth: number }) {
  const t = usePagesTranslation();
  const createPage = useCreatePage();
  const { page, children } = node;
  const expanded = useSidebarUiStore((s) => s.expanded.includes(page.id));
  const toggle = useSidebarUiStore((s) => s.toggle);
  const expand = useSidebarUiStore((s) => s.expand);
  const drop = useSidebarUiStore((s) =>
    s.dropTarget?.id === page.id ? s.dropTarget.position : null,
  );
  const drag = useDraggable({ id: page.id });
  const { setNodeRef: setDropRef } = useDroppable({ id: page.id });
  const Icon = PAGE_TYPE_ICON[page.type];
  const indent = depth * INDENT_PX + 4;

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
          'group/row hover:bg-hover has-[[data-status=active]]:bg-hover relative flex h-10 items-center gap-1 rounded-md pr-1 lg:h-8',
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

        <Link
          to="/p/$pageId"
          params={{ pageId: page.id }}
          draggable={false}
          className="data-[status=active]:text-foreground text-muted-foreground flex min-w-0 flex-1 items-center gap-2 text-sm data-[status=active]:font-medium"
        >
          {page.icon ? (
            <span className="w-4 shrink-0 text-center">{page.icon}</span>
          ) : (
            <Icon className="size-4 shrink-0" />
          )}
          <span className="truncate">{page.title || t.untitled}</span>
        </Link>

        <PageActionsMenu
          pageId={page.id}
          className="lg:opacity-0 lg:group-hover/row:opacity-100 lg:focus-visible:opacity-100 lg:data-[state=open]:opacity-100"
        />
        <button
          type="button"
          aria-label={t.addSubpage}
          title={t.addSubpage}
          onClick={() => void addInside()}
          className="text-muted-foreground hover:bg-hover flex size-6 shrink-0 items-center justify-center rounded lg:opacity-0 lg:group-hover/row:opacity-100 lg:focus-visible:opacity-100"
        >
          <Plus className="size-3.5" />
        </button>
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
