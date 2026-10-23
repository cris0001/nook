import { FileQuestion, Smile } from 'lucide-react';
import type { ReactNode } from 'react';

import { renamePage } from '@/lib/data/pages';
import type { Page } from '@/schemas/page.schema';
import { useOpenPage } from '../hooks/use-open-page';
import { usePage } from '../hooks/use-page';
import { usePagesTranslation } from '../i18n';
import { PageHeader } from './page-header';
import { PageIconPicker } from './page-icon-picker';

// A page's main column: header bar, icon and an editable title. Each keystroke is
// written straight to IndexedDB — local writes are cheap, and the sidebar title updates
// live with it. A brand-new (empty) page focuses its title, so typing goes straight
// into it. The body below the title depends on the page type and is supplied by the
// route (`body`), so this feature doesn't need to know about databases, editors, ….
export function PageView({ pageId, body }: { pageId: string; body?: (page: Page) => ReactNode }) {
  const t = usePagesTranslation();
  const state = usePage(pageId);
  useOpenPage(pageId);

  if (state.status === 'loading') {
    return null;
  }

  if (state.status === 'missing') {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-24 text-center">
        <FileQuestion className="text-muted-foreground size-8" />
        <p className="font-heading text-xl font-semibold">{t.notFound.title}</p>
        <p className="text-muted-foreground text-sm">{t.notFound.description}</p>
      </div>
    );
  }

  const { page } = state;
  return (
    <>
      <PageHeader page={page} />
      <article className="group/page w-full min-w-0 px-4 pt-8 pb-16 sm:px-8 lg:px-12 lg:pt-14">
        <PageIconPicker pageId={page.id} hasIcon={page.icon !== null}>
          {page.icon ? (
            <button
              type="button"
              aria-label={t.icon.change}
              className="hover:bg-hover mb-2 -ml-1 rounded-lg px-1 text-5xl leading-tight"
            >
              {page.icon}
            </button>
          ) : (
            <button
              type="button"
              className="text-muted-foreground hover:bg-hover hover:text-foreground mb-2 -ml-2 flex h-8 items-center gap-1.5 rounded-md px-2 text-sm transition-opacity lg:opacity-0 lg:group-hover/page:opacity-100 lg:focus-visible:opacity-100 lg:data-[state=open]:opacity-100"
            >
              <Smile className="size-4" />
              {t.icon.add}
            </button>
          )}
        </PageIconPicker>
        <input
          key={page.id}
          // A fresh page lands with the cursor in its title, ready to type.
          autoFocus={page.title === ''}
          defaultValue={page.title}
          placeholder={t.titlePlaceholder}
          aria-label={t.titlePlaceholder}
          onChange={(event) => void renamePage(page.id, event.target.value)}
          className="font-heading placeholder:text-muted-foreground/50 w-full bg-transparent text-3xl font-bold outline-none sm:text-4xl"
        />
        {body?.(page)}
      </article>
    </>
  );
}
