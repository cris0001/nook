import { Link } from '@tanstack/react-router';
import { Plus, Trash2 } from 'lucide-react';

import { BrandMark } from '@/components/brand';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';

import { useCreatePage } from '../hooks/use-create-page';
import { usePagesTranslation } from '../i18n';
import { PageTree } from './page-tree';

// Sidebar contents: wordmark with a compact "New page" action beside it, the page tree (scrolls on
// its own), the trash and settings toggles pinned at the bottom.
export function PageSidebar() {
  const t = usePagesTranslation();
  const createPage = useCreatePage();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 items-center justify-between gap-2 pr-3 pl-4">
        <Link to="/" aria-label="nOOk">
          <BrandMark animated className="text-[38px]" />
        </Link>
        <button
          type="button"
          aria-label={t.newPage}
          title={t.newPage}
          onClick={() => void createPage({ parentId: null, type: 'document' })}
          className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full transition-[filter] hover:brightness-95 lg:size-9"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <nav aria-label={t.pages} className="min-h-0 flex-1 overflow-y-auto px-2">
        <p className="text-muted-foreground px-2 pb-1 text-xs font-medium">{t.pages}</p>
        <PageTree />
      </nav>

      <div className="px-2 pb-1">
        <Link
          to="/trash"
          className="text-muted-foreground hover:bg-hover data-[status=active]:bg-hover data-[status=active]:text-foreground flex h-10 items-center gap-2 rounded-md px-2 text-sm lg:h-8"
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
