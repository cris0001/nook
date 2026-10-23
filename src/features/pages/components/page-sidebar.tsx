import { Link } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';

import { BrandMark } from '@/components/brand';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';

import { usePagesTranslation } from '../i18n';
import { FavoritesList } from './favorites-list';
import { NewPageMenu } from './new-page-menu';
import { PageTree } from './page-tree';

// Sidebar contents: the wordmark with a small "new" pill beside it, the page tree
// (scrolls on its own), the trash and settings toggles pinned at the bottom.
export function PageSidebar() {
  const t = usePagesTranslation();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-[4.5rem] items-center justify-between gap-2 pr-3 pl-4">
        <Link to="/" aria-label="nOOk">
          <BrandMark animated className="text-[46px]" />
        </Link>
        <NewPageMenu />
      </div>

      <nav aria-label={t.pages} className="min-h-0 flex-1 overflow-y-auto px-2">
        <FavoritesList />
        <p className="eyebrow px-2 pt-2 pb-2">{t.pages}</p>
        <PageTree />
      </nav>

      <div className="px-2 pb-1">
        <Link
          to="/trash"
          className="text-muted-foreground hover:bg-hover data-[status=active]:bg-background data-[status=active]:text-foreground flex h-10 items-center gap-2 rounded-sm px-2 text-sm data-[status=active]:shadow-[inset_2px_0_0_var(--color-primary)] lg:h-8"
        >
          <Trash2 className="size-4" />
          {t.trash.title}
        </Link>
      </div>

      <div className="flex items-center justify-between border-t px-3 py-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
