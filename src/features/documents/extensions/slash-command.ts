import { Extension } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';

import { useSlashMenuStore } from '../stores/slash-menu.store';
import type { SlashItem } from '../utils/slash-items';
import { suggestionRender } from '../utils/suggestion-render';

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: '/',
        items: () => [],
        command: ({ editor, range, props }) => props.run(editor, range),
        render: suggestionRender(useSlashMenuStore.getState),
      }),
    ];
  },
});
