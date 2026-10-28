import { useEditorState, type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  Bold,
  ChevronDown,
  Code,
  Italic,
  Link2,
  Strikethrough,
  Underline,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { useDocumentsTranslation } from '../i18n';
import { useFormatBarStore } from '../stores/format-bar.store';
import { BLOCK_TYPES } from '../utils/block-types';
import { ColorPanel } from './color-panel';
import { LinkInput } from './link-input';
import { TurnIntoPanel } from './turn-into-panel';

type Mark = 'bold' | 'italic' | 'underline' | 'strike' | 'code';

const MARKS: { mark: Mark; Icon: LucideIcon; keys: string }[] = [
  { mark: 'bold', Icon: Bold, keys: '⌘B' },
  { mark: 'italic', Icon: Italic, keys: '⌘I' },
  { mark: 'underline', Icon: Underline, keys: '⌘U' },
  { mark: 'strike', Icon: Strikethrough, keys: '⌘⇧S' },
  { mark: 'code', Icon: Code, keys: '⌘E' },
];

const BUTTON =
  'flex h-7 min-w-7 items-center justify-center rounded-md transition-colors hover:bg-hover';
const ON = 'bg-primary-tint text-primary-tint-foreground';
const DIVIDER = <span aria-hidden className="bg-border mx-0.5 h-5 w-px" />;

export function FormatBar({ editor }: { editor: Editor }) {
  const t = useDocumentsTranslation();
  const mode = useFormatBarStore((s) => s.mode);
  const setMode = useFormatBarStore((s) => s.setMode);
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      code: e.isActive('code'),
      link: e.isActive('link'),
      color: (e.getAttributes('textStyle').color as string | undefined) ?? null,
      block: BLOCK_TYPES.find((type) => type.isActive(e))?.id ?? 'text',
    }),
  });

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'top', offset: 8, onHide: () => setMode('marks') }}
      shouldShow={({ editor: e, from, to }) =>
        e.isEditable && from !== to && !e.isActive('codeBlock')
      }
      className="bg-background shadow-raised flex items-center gap-0.5 rounded-lg p-1"
    >
      {mode === 'link' ? (
        <LinkInput editor={editor} onDone={() => setMode('marks')} />
      ) : mode === 'color' ? (
        <ColorPanel editor={editor} />
      ) : mode === 'turnInto' ? (
        <TurnIntoPanel editor={editor} />
      ) : (
        <>
          <button
            type="button"
            title={t.format.turnInto}
            onClick={() => setMode('turnInto')}
            className={cn(BUTTON, 'gap-1 px-2 text-[13px] font-medium')}
          >
            {t.blocks[state.block][0]}
            <ChevronDown className="text-muted-foreground size-3.5" />
          </button>
          {DIVIDER}
          {MARKS.map(({ mark, Icon, keys }) => (
            <button
              key={mark}
              type="button"
              aria-label={t.format[mark]}
              title={`${t.format[mark]} ${keys}`}
              aria-pressed={state[mark]}
              onClick={() => editor.chain().focus().toggleMark(mark).run()}
              className={cn(BUTTON, state[mark] && ON)}
            >
              <Icon className="size-4" />
            </button>
          ))}
          <button
            type="button"
            aria-label={t.format.color}
            title={t.format.color}
            onClick={() => setMode('color')}
            className={cn(BUTTON, 'flex-col gap-0 text-[13px] leading-none font-semibold')}
          >
            A
            <span
              aria-hidden
              className="bg-foreground mt-0.5 h-0.5 w-3 rounded-full"
              style={state.color ? { background: state.color } : undefined}
            />
          </button>
          {DIVIDER}
          <button
            type="button"
            aria-label={t.format.link}
            title={`${t.format.link} ⌘K`}
            aria-pressed={state.link}
            onClick={() => setMode('link')}
            className={cn(BUTTON, 'gap-1.5 px-2 text-[13px]', state.link && ON)}
          >
            <Link2 className="size-4" />
            {t.format.link}
          </button>
        </>
      )}
    </BubbleMenu>
  );
}
