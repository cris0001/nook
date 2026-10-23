import { Plus } from 'lucide-react';

import { BrandMark } from '@/components/brand';

import { useCreatePage } from '../hooks/use-create-page';
import { usePages } from '../hooks/use-pages';
import { usePagesTranslation } from '../i18n';
import { recentOf } from '../utils/page-lists';
import { PageLinkRow } from './page-link-row';

// Landing view inside the workspace (no page selected). An empty workspace gets a
// direct "create" action; otherwise it points at the sidebar and lists the pages
// opened most recently.
export function WorkspaceHome() {
  const t = usePagesTranslation();
  const state = usePages();
  const createPage = useCreatePage();

  if (state.status === 'loading') {
    return null;
  }

  const empty = state.pages.length === 0;
  const recent = recentOf(state.pages, 6);
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-4 text-center">
      <BrandMark animated className="text-5xl" />
      <div className="space-y-1">
        <p className="font-heading text-xl font-semibold">
          {empty ? t.home.emptyTitle : t.home.pickTitle}
        </p>
        <p className="text-muted-foreground mx-auto max-w-xs text-sm">
          {empty ? t.home.emptyDescription : t.home.pickDescription}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void createPage({ parentId: null, type: 'document' })}
        className="bg-primary text-primary-foreground flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-[filter] hover:brightness-95"
      >
        <Plus className="size-4" />
        {t.newPage}
      </button>
      {recent.length > 0 ? (
        <section className="mt-6 w-full max-w-sm text-left">
          <p className="text-muted-foreground px-2 pb-1 text-xs font-medium">{t.recent}</p>
          <ul className="border-t">
            {recent.map((page) => (
              <li key={page.id} className="border-b">
                <PageLinkRow page={page} className="rounded-none" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
