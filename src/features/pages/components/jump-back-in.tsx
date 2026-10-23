import { Link } from '@tanstack/react-router';
import { formatDistanceToNowStrict } from 'date-fns';
import { pl } from 'date-fns/locale';

import { BrandMark } from '@/components/brand';
import { useLocaleStore } from '@/stores/locale.store';

import { usePages } from '../hooks/use-pages';
import { usePagesTranslation } from '../i18n';
import { PAGE_TYPE_ICON } from '../utils/page-icon';
import { recentOf } from '../utils/page-lists';

// Recently opened pages for the home screen's side column, plus a small keyboard tip.
export function JumpBackIn() {
  const t = usePagesTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const state = usePages();
  const recent = state.status === 'ready' ? recentOf(state.pages, 5) : [];

  return (
    <div>
      <p className="flex h-7 items-center text-xs font-semibold">{t.recent}</p>
      <ul className="-mx-2">
        {recent.map((page) => {
          const Icon = PAGE_TYPE_ICON[page.type];
          return (
            <li key={page.id}>
              <Link
                to="/p/$pageId"
                params={{ pageId: page.id }}
                className="hover:bg-hover flex items-center gap-3 rounded-lg px-2 py-2"
              >
                <span className="flex w-5 justify-center text-base">
                  {page.icon ?? <Icon className="text-muted-foreground size-4" />}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {page.title || t.untitled}
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {formatDistanceToNowStrict(page.lastOpenedAt ?? 0, {
                    ...(locale === 'pl' ? { locale: pl } : {}),
                  })}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="text-muted-foreground mt-6 flex items-center gap-3 rounded-xl border border-dashed p-3 text-[12.5px] leading-relaxed">
        <BrandMark className="text-xl" />
        <p>{t.tip}</p>
      </div>
    </div>
  );
}
