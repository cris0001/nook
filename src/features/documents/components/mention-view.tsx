import { Link } from '@tanstack/react-router';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';

import { PAGE_TYPE_ICON } from '@/components/page-type-icon';
import { cn } from '@/lib/utils';

import { useMentionTarget } from '../hooks/use-mention-target';
import { useDocumentsTranslation } from '../i18n';

export function MentionView({ node }: NodeViewProps) {
  const t = useDocumentsTranslation();
  const id = String(node.attrs.id);
  const target = useMentionTarget(id);
  const fallback = typeof node.attrs.label === 'string' ? node.attrs.label : '';

  if (target && !target.page) {
    return (
      <NodeViewWrapper
        as="span"
        className="text-muted-foreground line-through"
        title={t.mention.deleted}
      >
        @{fallback || t.mention.deleted}
      </NodeViewWrapper>
    );
  }

  const page = target?.page;
  const Icon = PAGE_TYPE_ICON[page?.type ?? 'document'];
  const status = target?.status;

  return (
    <NodeViewWrapper as="span" className="mention">
      <Link
        to="/p/$pageId"
        params={{ pageId: id }}
        draggable={false}
        className="hover:bg-hover text-foreground inline-flex items-baseline gap-1 rounded px-0.5 align-baseline no-underline"
      >
        {page?.icon ? (
          <span className="text-[0.95em]">{page.icon}</span>
        ) : (
          <Icon className="text-muted-foreground size-[0.9em] translate-y-[0.1em] self-center" />
        )}
        <span
          className={cn(
            'decoration-border font-medium underline decoration-1 underline-offset-[3px]',
            status?.done && 'text-muted-foreground line-through',
          )}
        >
          {[page?.title, fallback].find(Boolean) ?? t.untitledPage}
        </span>
        {status ? (
          <span className="text-muted-foreground inline-flex items-center gap-1 text-[0.8em] font-normal">
            <i
              aria-hidden
              className="size-[0.45em] rounded-full"
              style={{ background: `var(--dot-${status.option.color})` }}
            />
            {status.option.name}
          </span>
        ) : null}
      </Link>
    </NodeViewWrapper>
  );
}
