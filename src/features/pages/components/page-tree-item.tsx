import { Link } from '@tanstack/react-router';
import { ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { useCreatePage } from '../hooks/use-create-page';
import { usePagesTranslation } from '../i18n';
import { PAGE_TYPE_ICON } from '../utils/page-icon';
import type { PageNode } from '../utils/page-tree';
import { PageActionsMenu } from './page-actions-menu';

// One row of the sidebar tree, plus its children when expanded. Indentation grows with
// depth; the expand chevron, the actions menu and the "add inside" button sit on the
// row so they're one tap away. Rows are taller on touch screens (h-10) than on desktop (h-8).
export function PageTreeItem({ node, depth }: { node: PageNode; depth: number }) {
  const t = usePagesTranslation();
  const createPage = useCreatePage();
  const [expanded, setExpanded] = useState(false);
  const { page, children } = node;
  const Icon = PAGE_TYPE_ICON[page.type];

  async function addInside() {
    setExpanded(true);
    await createPage({ parentId: page.id, type: 'document' });
  }

  return (
    <li>
      <div
        className="group/row hover:bg-hover has-[[data-status=active]]:bg-hover relative flex h-10 items-center gap-1 rounded-md pr-1 lg:h-8"
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
      >
        <button
          type="button"
          aria-label={expanded ? t.collapse : t.expand}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
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
