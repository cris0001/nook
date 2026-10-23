import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { RotateCcw, Trash2 } from 'lucide-react';

import { useConfirm } from '@/stores/confirm.store';
import { useLocaleStore } from '@/stores/locale.store';

import { usePermissions } from '@/hooks/use-can';
import { deletePageForever, restorePage } from '@/lib/data/pages';
import { useTrash } from '../hooks/use-trash';
import { usePagesTranslation } from '../i18n';
import { PAGE_TYPE_ICON } from '../utils/page-icon';

// The trash: one row per trashed batch, with restore and delete-forever. Restored
// pages reappear in the sidebar on their own thanks to the live queries.
export function TrashView() {
  const t = usePagesTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const state = useTrash();
  const confirm = useConfirm();
  const allowed = usePermissions();

  if (state.status === 'loading') {
    return null;
  }

  async function onDelete(id: string, title: string) {
    const ok = await confirm({
      title: t.trash.confirmDelete(title || t.untitled),
      confirmText: t.trash.deleteForever,
      destructive: true,
    });
    if (ok) {
      await deletePageForever(id);
    }
  }

  return (
    <section className="w-full px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
      <h1 className="font-heading text-3xl font-bold">{t.trash.title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">{t.trash.description}</p>

      {state.pages.length === 0 ? (
        <p className="text-muted-foreground mt-10 text-sm">{t.trash.empty}</p>
      ) : (
        <ul className="mt-6 divide-y rounded-md border">
          {state.pages.map((page) => {
            const Icon = PAGE_TYPE_ICON[page.type];
            const when = formatDistanceToNow(page.deletedAt ?? 0, {
              addSuffix: true,
              ...(locale === 'pl' ? { locale: pl } : {}),
            });
            return (
              <li key={page.id} className="flex items-center gap-3 px-3 py-2.5">
                {page.icon ? (
                  <span className="w-5 text-center">{page.icon}</span>
                ) : (
                  <Icon className="text-muted-foreground size-5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{page.title || t.untitled}</p>
                  <p className="text-muted-foreground text-xs">{t.trash.deletedAgo(when)}</p>
                </div>
                {allowed('page.trash') ? (
                  <button
                    type="button"
                    aria-label={t.trash.restore}
                    title={t.trash.restore}
                    onClick={() => void restorePage(page.id)}
                    className="hover:bg-hover flex size-10 items-center justify-center rounded-lg lg:size-8"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                ) : null}
                {allowed('page.deleteForever') ? (
                  <button
                    type="button"
                    aria-label={t.trash.deleteForever}
                    title={t.trash.deleteForever}
                    onClick={() => void onDelete(page.id, page.title)}
                    className="text-destructive hover:bg-hover flex size-10 items-center justify-center rounded-lg lg:size-8"
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
