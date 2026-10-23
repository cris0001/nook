import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import type { Page } from '@/schemas/page.schema';

import { usePagesTranslation } from '../i18n';
import { PAGE_TYPE_ICON } from '../utils/page-icon';

// A flat, non-draggable link to a page — favorites in the sidebar, recents on the home
// screen. Same icon/title treatment as the tree rows.
export function PageLinkRow({ page, className }: { page: Page; className?: string }) {
  const t = usePagesTranslation();
  const Icon = PAGE_TYPE_ICON[page.type];

  return (
    <Link
      to="/p/$pageId"
      params={{ pageId: page.id }}
      className={cn(
        'text-muted-foreground hover:bg-hover data-[status=active]:bg-hover data-[status=active]:text-foreground flex h-10 min-w-0 items-center gap-2 rounded-md px-2 text-sm data-[status=active]:font-medium lg:h-8',
        className,
      )}
    >
      {page.icon ? (
        <span className="w-4 shrink-0 text-center">{page.icon}</span>
      ) : (
        <Icon className="size-4 shrink-0" />
      )}
      <span className="truncate">{page.title || t.untitled}</span>
    </Link>
  );
}
