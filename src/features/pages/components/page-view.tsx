import { FileQuestion } from 'lucide-react';

import { renamePage } from '../api/pages';
import { usePage } from '../hooks/use-page';
import { usePagesTranslation } from '../i18n';

// A page's main column. For now: an editable title. Each keystroke is written straight
// to IndexedDB — local writes are cheap, and the sidebar title updates live with it.
// A brand-new (empty) page focuses its title, so typing goes straight into it.
// Content per page type (editor, board, canvas, …) lands in later stages.
export function PageView({ pageId }: { pageId: string }) {
  const t = usePagesTranslation();
  const state = usePage(pageId);

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
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 lg:py-16">
      {page.icon ? <div className="mb-3 text-5xl">{page.icon}</div> : null}
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
    </article>
  );
}
