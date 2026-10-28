import { Extension } from '@tiptap/react';

import { useFormatBarStore } from '../stores/format-bar.store';

// ⌘K with text selected edits the link; with nothing selected it returns false, so the
// event reaches the window and opens the command palette instead.
export const LinkShortcut = Extension.create({
  name: 'linkShortcut',
  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        if (this.editor.state.selection.empty || this.editor.isActive('codeBlock')) return false;
        useFormatBarStore.getState().setMode('link');
        return true;
      },
    };
  },
});
