import { Database, FileText } from 'lucide-react';

import { BrandMark } from '@/components/brand';

import { useCreatePage } from '../hooks/use-create-page';
import { usePages } from '../hooks/use-pages';
import { usePagesTranslation } from '../i18n';
import { recentOf } from '../utils/page-lists';
import { PageLinkRow } from './page-link-row';

// Landing view inside the workspace (no page selected): the wordmark, quick "new page /
// new database" actions and the pages opened most recently. Left-aligned like every
// other view.
export function WorkspaceHome() {
  const t = usePagesTranslation();
  const state = usePages();
  const createPage = useCreatePage();

  if (state.status === 'loading') {
    return null;
  }

  const empty = state.pages.length === 0;
  const recent = recentOf(state.pages, 8);
  return (
    <div className="w-full px-4 pt-10 pb-16 sm:px-8 lg:px-12 lg:pt-16">
      <BrandMark animated className="text-6xl" />
      <h1 className="font-heading mt-8 text-2xl font-bold">
        {empty ? t.home.emptyTitle : t.home.pickTitle}
      </h1>
      <p className="text-muted-foreground mt-1 max-w-md text-sm">
        {empty ? t.home.emptyDescription : t.home.pickDescription}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void createPage({ parentId: null, type: 'document' })}
          className="btn-primary h-9 px-3 text-sm"
        >
          <FileText className="size-4" />
          {t.newPage}
        </button>
        <button
          type="button"
          onClick={() => void createPage({ parentId: null, type: 'database' })}
          className="hover:bg-hover inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium"
        >
          <Database className="size-4" />
          {t.newDatabase}
        </button>
      </div>
      {recent.length > 0 ? (
        <section className="mt-12 max-w-xl">
          <p className="eyebrow pb-2">{t.recent}</p>
          <ul className="border-t">
            {recent.map((page) => (
              <li key={page.id} className="border-b">
                <PageLinkRow page={page} className="rounded-none px-1" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
