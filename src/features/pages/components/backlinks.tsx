import { Link } from '@tanstack/react-router';
import { CornerDownRight } from 'lucide-react';

import { PAGE_TYPE_ICON } from '@/components/page-type-icon';

import { useBacklinks } from '../hooks/use-backlinks';
import { usePagesTranslation } from '../i18n';

export function Backlinks({ pageId }: { pageId: string }) {
  const t = usePagesTranslation();
  const pages = useBacklinks(pageId);

  if (pages.length === 0) {
    return null;
  }

  return (
    <section className="border-divider mt-12 border-t pt-5">
      <h2 className="eyebrow mb-2 flex items-center gap-2">
        <CornerDownRight className="size-3.5" />
        {t.backlinks}
        <span className="text-foreground">{pages.length}</span>
      </h2>
      <ul className="-mx-2">
        {pages.map((page) => {
          const Icon = PAGE_TYPE_ICON[page.type];
          return (
            <li key={page.id}>
              <Link
                to="/p/$pageId"
                params={{ pageId: page.id }}
                className="hover:bg-hover flex h-9 items-center gap-2.5 rounded-md px-2 text-sm"
              >
                {page.icon ? (
                  <span className="w-4 text-center">{page.icon}</span>
                ) : (
                  <Icon className="text-muted-foreground size-4" />
                )}
                <span className="truncate font-medium">{page.title || t.untitled}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
