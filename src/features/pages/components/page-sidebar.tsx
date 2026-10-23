import { Link } from '@tanstack/react-router';
import { House, Trash2 } from 'lucide-react';

import { BrandMark } from '@/components/brand';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

import { usePagesTranslation } from '../i18n';
import { ACTIVE_SELF, SECTION_LABEL, SIDEBAR_ROW } from '../utils/row-styles';
import { FavoritesList } from './favorites-list';
import { NewPageMenu } from './new-page-menu';
import { PageTree } from './page-tree';

// Sidebar contents, sitting on the window background: wordmark with the "new" pill,
// Today, favorites, the page tree (scrolls on its own), and the trash and settings
// pinned at the bottom.
export function PageSidebar() {
  const t = usePagesTranslation();

  return (
    <div className="flex h-full min-h-0 flex-col px-2.5 pt-2.5 pb-2">
      <div className="flex h-12 items-center justify-between pr-1 pl-2">
        <Link to="/" aria-label="nOOk">
          <BrandMark animated className="text-[36px]" />
        </Link>
        <NewPageMenu />
      </div>

      <Link
        to="/"
        activeOptions={{ exact: true }}
        className={cn(SIDEBAR_ROW, ACTIVE_SELF, 'mt-3 gap-2 px-2')}
      >
        <House className="size-4 shrink-0" />
        {t.today}
      </Link>

      <nav aria-label={t.pages} className="-mx-1.5 min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
        <FavoritesList />
        <p className={SECTION_LABEL}>{t.pages}</p>
        <PageTree />
      </nav>

      <Link to="/trash" className={cn(SIDEBAR_ROW, ACTIVE_SELF, 'gap-2 px-2')}>
        <Trash2 className="size-4 shrink-0" />
        {t.trash.title}
      </Link>
      <div className="mt-1 flex items-center justify-between">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
