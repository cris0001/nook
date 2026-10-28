import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Placeholder } from '@tiptap/extensions';
import { Highlight } from '@tiptap/extension-highlight';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useMemo, useState } from 'react';

import { saveContent } from '@/lib/data/contents';
import { debounce } from '@/utils/debounce';

import { LinkShortcut } from '../extensions/link-shortcut';
import { PageMention } from '../extensions/page-mention';
import { SlashCommand } from '../extensions/slash-command';
import { usePageContent } from '../hooks/use-page-content';
import { useDocumentsTranslation } from '../i18n';
import { normalizeUrl } from '@/utils/safe-url';

import { BlockHandle } from './block-handle';
import { FormatBar } from './format-bar';
import { MentionMenu } from './mention-menu';
import { SlashMenu } from './slash-menu';

const SAVE_DELAY_MS = 400;

export function DocumentEditor({
  pageId,
  editable = true,
}: {
  pageId: string;
  editable?: boolean;
}) {
  const state = usePageContent(pageId);
  if (state.status === 'loading') {
    return null;
  }
  return <Editor key={pageId} pageId={pageId} initial={state.doc} editable={editable} />;
}

function Editor({
  pageId,
  initial,
  editable,
}: {
  pageId: string;
  initial: JSONContent | null;
  editable: boolean;
}) {
  const t = useDocumentsTranslation();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const save = useMemo(
    () => debounce((doc: JSONContent) => void saveContent(pageId, doc), SAVE_DELAY_MS),
    [pageId],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          isAllowedUri: (url) => normalizeUrl(url) !== null,
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        // Read at draw time, so a language switch applies without rebuilding the editor.
        placeholder: ({ node }) => {
          const copy = useDocumentsTranslation.peek();
          return node.type.name === 'heading' ? copy.emptyHeading : copy.placeholder;
        },
      }),
      SlashCommand,
      PageMention,
      LinkShortcut,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    editable,
    content: initial ?? '',
    editorProps: { attributes: { class: 'nook-prose' } },
    onUpdate: ({ editor: e }) => save(e.getJSON()),
  });

  useEffect(() => () => save.flush(), [save]);

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  // An empty transaction makes the placeholders redraw in the new language.
  useEffect(() => {
    editor.view.dispatch(editor.state.tr);
  }, [t, editor]);

  return (
    <div ref={setContainer} className="relative mt-4">
      <EditorContent editor={editor} />
      {editable ? (
        <>
          <BlockHandle editor={editor} container={container} />
          <FormatBar editor={editor} />
          <SlashMenu />
          <MentionMenu pageId={pageId} />
        </>
      ) : null}
    </div>
  );
}
