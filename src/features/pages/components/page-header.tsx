import { Link } from '@tanstack/react-router';
import { formatDistanceToNowStrict } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { Fragment } from 'react';

import { cn } from '@/lib/utils';
import type { Page } from '@/schemas/page.schema';
import { useLocaleStore } from '@/stores/locale.store';

import { toggleFavorite } from '@/lib/data/pages';
import { usePages } from '../hooks/use-pages';
import { usePagesTranslation } from '../i18n';
import { ancestorsOf } from '../utils/page-lists';
import { PageActionsMenu } from './page-actions-menu';

// Slim bar above a page: breadcrumbs on the left (ancestors are links, the page itself
// is plain text), the favorite star and the actions menu on the right. Breadcrumbs
// truncate rather than wrap so the bar keeps one line on phones.
export function PageHeader({ page }: { page: Page }) {
  const t = usePagesTranslation();
  const state = usePages();
  const ancestors = state.status === 'ready' ? ancestorsOf(state.pages, page.id) : [];
  const starred = page.favoritedAt !== null;
  const locale = useLocaleStore((s) => s.locale);

  return (
    <div className="bg-background/90 border-divider sticky top-0 z-20 flex h-12 shrink-0 items-center gap-1 border-b px-3 backdrop-blur sm:px-4">
      <nav aria-label={t.breadcrumbs} className="min-w-0 flex-1">
        <ol className="text-muted-foreground flex min-w-0 items-center gap-1 text-sm">
          {ancestors.map((ancestor) => (
            <Fragment key={ancestor.id}>
              <li className="max-w-40 min-w-0 shrink">
                <Link
                  to="/p/$pageId"
                  params={{ pageId: ancestor.id }}
                  className="hover:bg-hover hover:text-foreground block truncate rounded px-1 py-0.5"
                >
                  {ancestor.icon ? `${ancestor.icon} ` : ''}
                  {ancestor.title || t.untitled}
                </Link>
              </li>
              <li aria-hidden className="opacity-40">
                /
              </li>
            </Fragment>
          ))}
          <li aria-current="page" className="text-foreground min-w-0 truncate px-1 font-medium">
            {page.icon ? `${page.icon} ` : ''}
            {page.title || t.untitled}
          </li>
        </ol>
      </nav>

      <span className="text-muted-foreground mr-1 hidden text-xs whitespace-nowrap sm:inline">
        {t.edited(
          formatDistanceToNowStrict(page.updatedAt, {
            addSuffix: true,
            ...(locale === 'pl' ? { locale: pl } : {}),
          }),
        )}
      </span>
      <button
        type="button"
        aria-pressed={starred}
        aria-label={starred ? t.favorite.remove : t.favorite.add}
        title={starred ? t.favorite.remove : t.favorite.add}
        onClick={() => void toggleFavorite(page.id)}
        className="hover:bg-hover flex size-8 items-center justify-center rounded-md"
      >
        <Star
          className={cn(
            'size-4',
            starred ? 'fill-primary text-primary-text' : 'text-muted-foreground',
          )}
        />
      </button>
      <PageActionsMenu pageId={page.id} className="size-8 rounded-md" />
    </div>
  );
}
