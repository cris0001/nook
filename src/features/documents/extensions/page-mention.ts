import { Mention } from '@tiptap/extension-mention';
import { PluginKey } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';

import { MENTION_NODE } from '@/utils/mentions';

import { MentionView } from '../components/mention-view';
import { useMentionMenuStore } from '../stores/mention-menu.store';
import type { MentionItem } from '../utils/mention-items';
import { suggestionRender } from '../utils/suggestion-render';

// `id` is the page id; `label` is the title at insertion time, used only when the page
// is gone and for plain-text copies — the node view always shows the live title. The
// suggestion plugin is our own (not Mention's) so its items can be pages or "create".
export const PageMention = Mention.extend({
  name: MENTION_NODE,
  addNodeView() {
    return ReactNodeViewRenderer(MentionView, { as: 'span' });
  },
  addProseMirrorPlugins() {
    return [
      Suggestion<MentionItem, MentionItem>({
        editor: this.editor,
        char: '@',
        allowSpaces: true,
        pluginKey: new PluginKey('pageMention'),
        items: () => [],
        command: ({ editor, range, props }) => props.run(editor, range),
        render: suggestionRender(useMentionMenuStore.getState),
      }),
    ];
  },
}).configure({
  renderText: ({ node }) => `@${String(node.attrs.label ?? '')}`,
});
