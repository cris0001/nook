import { FileQuestion, Smile } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

import { usePermissions } from '@/hooks/use-can';
import { useDebouncedRename } from '@/hooks/use-debounced-rename';
import type { Page } from '@/schemas/page.schema';
import { useOpenPage } from '../hooks/use-open-page';
import { usePage } from '../hooks/use-page';
import { usePagesTranslation } from '../i18n';
import { PageHeader } from './page-header';
import { PageIconPicker } from './page-icon-picker';

export function PageView({
  pageId,
  body,
}: {
  pageId: string;
  body?: (page: Page, editable: boolean) => ReactNode;
}) {
  const allowed = usePermissions();
  const rename = useDebouncedRename(pageId);
  const t = usePagesTranslation();
  const state = usePage(pageId);
  useOpenPage(pageId);
  const titleInput = useRef<HTMLInputElement>(null);
  const title = state.status === 'ready' ? state.page.title : null;

  // The title input is uncontrolled (typing writes straight to the database). When the
  // title changes elsewhere — renamed in the sidebar — sync it, unless it's being typed in.
  useEffect(() => {
    const input = titleInput.current;
    if (input && title !== null && document.activeElement !== input && input.value !== title) {
      input.value = title;
    }
  }, [title]);

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
  const editable = allowed(page.type === 'record' ? 'record.edit' : 'page.edit');
  return (
    <>
      <PageHeader page={page} readOnly={!editable} />
      <article className="group/page w-full min-w-0 px-4 pt-6 pb-16 sm:px-8 lg:px-12 lg:pt-10">
        {editable ? (
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
        ) : page.icon ? (
          <p className="mb-2 text-5xl leading-tight">{page.icon}</p>
        ) : null}
        <input
          ref={titleInput}
          key={page.id}
          autoFocus={editable && page.title === ''}
          readOnly={!editable}
          defaultValue={page.title}
          placeholder={t.titlePlaceholder}
          aria-label={t.titlePlaceholder}
          onChange={(event) => rename(event.target.value)}
          onBlur={() => rename.flush()}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== 'ArrowDown') return;
            const body = event.currentTarget
              .closest('article')
              ?.querySelector('[contenteditable=true]');
            if (body instanceof HTMLElement) {
              event.preventDefault();
              body.focus();
            }
          }}
          className="font-heading placeholder:text-muted-foreground/50 w-full bg-transparent text-[30px] leading-tight font-bold tracking-tight outline-none [font-variation-settings:'opsz'_96] sm:text-[36px]"
        />
        {body?.(page, editable)}
      </article>
    </>
  );
}
