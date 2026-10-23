import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import type { Page } from '@/schemas/page.schema';

import { usePagesTranslation } from '../i18n';
import { PAGE_TYPE_ICON } from '../utils/page-icon';
import { ACTIVE_SELF, SIDEBAR_ROW } from '../utils/row-styles';

// A flat, non-draggable link to a page — favorites in the sidebar, recents on the home
// screen. Same icon/title treatment as the tree rows.
export function PageLinkRow({ page, className }: { page: Page; className?: string }) {
  const t = usePagesTranslation();
  const Icon = PAGE_TYPE_ICON[page.type];

  return (
    <Link
      to="/p/$pageId"
      params={{ pageId: page.id }}
      className={cn(SIDEBAR_ROW, ACTIVE_SELF, 'gap-2 px-2', className)}
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
