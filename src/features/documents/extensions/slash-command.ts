import { Extension } from '@tiptap/react';
import Suggestion, { type SuggestionProps } from '@tiptap/suggestion';

import { useSlashMenuStore } from '../stores/slash-menu.store';
import type { SlashItem } from '../utils/slash-items';

// Typing "/" opens the block menu. The suggestion plugin only tracks the "/query" and
// the caret position; filtering and rendering happen in the React SlashMenu, which
// reads them from the store. Arrow keys / Enter / Escape are handled here so the
// editor doesn't also act on them while the menu is open.
export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    const store = useSlashMenuStore.getState;

    const sync = (props: SuggestionProps<SlashItem, SlashItem>) =>
      store().show({
        query: props.query,
        rect: props.clientRect?.() ?? null,
        pick: (item) => props.command(item),
      });

    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: '/',
        items: () => [],
        command: ({ editor, range, props }) => props.run(editor, range),
        render: () => ({
          onStart: sync,
          onUpdate: sync,
          onExit: () => store().hide(),
          onKeyDown: ({ event }) => {
            const { items, index, pick, setIndex, hide } = store();
            if (event.key === 'Escape') {
              hide();
              return true;
            }
            if (!items.length) {
              return false;
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              const step = event.key === 'ArrowDown' ? 1 : -1;
              setIndex((index + step + items.length) % items.length);
              return true;
            }
            if (event.key === 'Enter') {
              const item = items[index];
              if (item && pick) pick(item);
              return true;
            }
            return false;
          },
        }),
      }),
    ];
  },
});
