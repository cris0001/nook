import { Plus } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import { PAGE_TYPE_ICON } from '@/components/page-type-icon';
import { useCan } from '@/hooks/use-can';
import { createPage } from '@/lib/data/pages';
import { cn } from '@/lib/utils';

import { useMentionCandidates } from '../hooks/use-mention-candidates';
import { useDocumentsTranslation } from '../i18n';
import { useMentionMenuStore } from '../stores/mention-menu.store';
import { insertMention, type MentionItem } from '../utils/mention-items';
import { SUGGESTION_MAX_HEIGHT, SuggestionPopup } from './suggestion-popup';

export function MentionMenu({ pageId }: { pageId: string }) {
  const t = useDocumentsTranslation();
  const { open, query, rect, index, pick, setIndex, setItems } = useMentionMenuStore();
  const canCreate = useCan('page.create');
  const candidates = useMentionCandidates(query, pageId);
  const listRef = useRef<HTMLUListElement>(null);
  const title = query.trim();

  const items = useMemo<MentionItem[]>(() => {
    const found: MentionItem[] = candidates.map(({ page, path }) => ({
      kind: 'page',
      key: page.id,
      page,
      path,
      run: (editor, range) => insertMention(editor, range, page),
    }));
    const exact = candidates.some((c) => c.page.title.toLowerCase() === title.toLowerCase());
    if (canCreate && title && !exact) {
      found.push({
        kind: 'create',
        key: 'create',
        title,
        run: (editor, range) =>
          void createPage({ parentId: null, type: 'document', title }).then((page) =>
            insertMention(editor, range, page),
          ),
      });
    }
    return found;
  }, [candidates, canCreate, title]);

  useEffect(() => {
    setItems(items);
  }, [items, setItems]);

  useEffect(() => {
    listRef.current?.children[index]?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  if (!open || !rect) {
    return null;
  }

  return (
    <SuggestionPopup rect={rect} label={t.mention.label} width={320}>
      <p className="eyebrow px-2 pt-1.5 pb-1">{t.mention.label}</p>
      {items.length === 0 ? (
        <p className="text-muted-foreground px-2 py-2 text-sm">{t.mention.empty}</p>
      ) : (
        <ul ref={listRef} className="overflow-y-auto" style={{ maxHeight: SUGGESTION_MAX_HEIGHT }}>
          {items.map((item, i) => {
            const Icon = item.kind === 'page' ? PAGE_TYPE_ICON[item.page.type] : Plus;
            return (
              <li key={item.key} role="option" aria-selected={i === index}>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    pick?.(item);
                  }}
                  onMouseEnter={() => setIndex(i)}
                  className={cn(
                    'flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-sm',
                    i === index && 'bg-hover',
                  )}
                >
                  {item.kind === 'page' && item.page.icon ? (
                    <span className="w-4 shrink-0 text-center">{item.page.icon}</span>
                  ) : (
                    <Icon className="text-muted-foreground size-4 shrink-0" />
                  )}
                  <span className="min-w-0 truncate">
                    {item.kind === 'page'
                      ? item.page.title || t.untitledPage
                      : t.mention.create(item.title)}
                  </span>
                  {item.kind === 'page' && item.path ? (
                    <span className="text-muted-foreground ml-auto truncate pl-2 text-xs">
                      {item.path}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </SuggestionPopup>
  );
}
