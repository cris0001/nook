import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import type { Page } from '@/schemas/page.schema';

import { usePagesTranslation } from '../i18n';
import { PAGE_TYPE_ICON } from '@/components/page-type-icon';
import { ACTIVE_SELF, SIDEBAR_ROW } from '../utils/row-styles';
import { DatabaseProgress } from './database-progress';

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
      <span className="flex-1 truncate">{page.title || t.untitled}</span>
      {page.type === 'database' ? <DatabaseProgress databaseId={page.id} /> : null}
    </Link>
  );
}
