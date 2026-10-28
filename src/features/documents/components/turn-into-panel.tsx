import { useEditorState, type Editor } from '@tiptap/react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useDocumentsTranslation } from '../i18n';
import { useFormatBarStore } from '../stores/format-bar.store';
import { BLOCK_TYPES } from '../utils/block-types';

export function TurnIntoPanel({ editor }: { editor: Editor }) {
  const t = useDocumentsTranslation();
  const setMode = useFormatBarStore((s) => s.setMode);
  const current = useEditorState({
    editor,
    selector: ({ editor: e }) => BLOCK_TYPES.find((type) => type.isActive(e))?.id ?? null,
  });

  return (
    <div className="w-52 p-0.5">
      <p className="eyebrow px-2 pt-1.5 pb-1">{t.format.turnInto}</p>
      {BLOCK_TYPES.map(({ id, Icon, apply }) => (
        <button
          key={id}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            apply(editor);
            setMode('marks');
          }}
          className={cn(
            'hover:bg-hover flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px]',
            id === current && 'font-medium',
          )}
        >
          <Icon className="text-muted-foreground size-4" />
          <span className="flex-1">{t.blocks[id][0]}</span>
          {id === current ? <Check className="text-primary-text size-3.5" /> : null}
        </button>
      ))}
    </div>
  );
}
