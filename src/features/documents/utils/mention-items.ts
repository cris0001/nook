import type { Editor, Range } from '@tiptap/react';

import type { Page } from '@/schemas/page.schema';

export type MentionItem =
  | {
      kind: 'page';
      key: string;
      page: Page;
      path: string;
      run: (editor: Editor, range: Range) => void;
    }
  | { kind: 'create'; key: string; title: string; run: (editor: Editor, range: Range) => void };

export function insertMention(editor: Editor, range: Range, page: Pick<Page, 'id' | 'title'>) {
  editor
    .chain()
    .focus()
    .insertContentAt(range, [
      { type: 'mention', attrs: { id: page.id, label: page.title } },
      { type: 'text', text: ' ' },
    ])
    .run();
}
