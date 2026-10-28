import { useEditorState, type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Code, Italic, Link2, Strikethrough, Underline, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useDocumentsTranslation } from '../i18n';
import { useFormatBarStore } from '../stores/format-bar.store';
import { LinkInput } from './link-input';

type Mark = 'bold' | 'italic' | 'underline' | 'strike' | 'code';

const MARKS: { mark: Mark; Icon: LucideIcon; keys: string }[] = [
  { mark: 'bold', Icon: Bold, keys: '⌘B' },
  { mark: 'italic', Icon: Italic, keys: '⌘I' },
  { mark: 'underline', Icon: Underline, keys: '⌘U' },
  { mark: 'strike', Icon: Strikethrough, keys: '⌘⇧S' },
  { mark: 'code', Icon: Code, keys: '⌘E' },
];

const BUTTON =
  'flex size-7 items-center justify-center rounded-md transition-colors hover:bg-hover';

export function FormatBar({ editor }: { editor: Editor }) {
  const t = useDocumentsTranslation();
  const editingLink = useFormatBarStore((s) => s.editingLink);
  const setEditingLink = useFormatBarStore((s) => s.setEditingLink);
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      code: e.isActive('code'),
      link: e.isActive('link'),
    }),
  });

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'top', offset: 8, onHide: () => setEditingLink(false) }}
      shouldShow={({ editor: e, from, to }) =>
        e.isEditable && from !== to && !e.isActive('codeBlock')
      }
      className="bg-background shadow-raised flex items-center gap-0.5 rounded-lg p-1"
    >
      {editingLink ? (
        <LinkInput editor={editor} onDone={() => setEditingLink(false)} />
      ) : (
        <>
          {MARKS.map(({ mark, Icon, keys }) => (
            <button
              key={mark}
              type="button"
              aria-label={t.format[mark]}
              title={`${t.format[mark]} ${keys}`}
              aria-pressed={active[mark]}
              onClick={() => editor.chain().focus().toggleMark(mark).run()}
              className={cn(BUTTON, active[mark] && 'bg-primary-tint text-primary-tint-foreground')}
            >
              <Icon className="size-4" />
            </button>
          ))}
          <span aria-hidden className="bg-border mx-0.5 h-5 w-px" />
          <button
            type="button"
            aria-label={t.format.link}
            title={`${t.format.link} ⌘K`}
            aria-pressed={active.link}
            onClick={() => setEditingLink(true)}
            className={cn(
              BUTTON,
              'w-auto gap-1.5 px-2 text-[13px]',
              active.link && 'bg-primary-tint text-primary-tint-foreground',
            )}
          >
            <Link2 className="size-4" />
            {t.format.link}
          </button>
        </>
      )}
    </BubbleMenu>
  );
}
