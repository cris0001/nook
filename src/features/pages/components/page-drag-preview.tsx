import type { Page } from '@/schemas/page.schema';

import { usePagesTranslation } from '../i18n';
import { PAGE_TYPE_ICON } from '../utils/page-icon';

// The chip that follows the pointer while a page is dragged.
export function PageDragPreview({ page }: { page: Page }) {
  const t = usePagesTranslation();
  const Icon = PAGE_TYPE_ICON[page.type];
  return (
    <div className="bg-background flex h-8 w-max max-w-56 cursor-grabbing items-center gap-2 rounded-md border px-2 text-sm shadow-md">
      {page.icon ? <span>{page.icon}</span> : <Icon className="text-muted-foreground size-4" />}
      <span className="truncate">{page.title || t.untitled}</span>
    </div>
  );
}
