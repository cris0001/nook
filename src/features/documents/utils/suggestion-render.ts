import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';

import type { SuggestionState } from './suggestion-store';

export function suggestionRender<T>(store: () => SuggestionState<T>) {
  const sync = (props: SuggestionProps<T, T>) =>
    store().show({
      query: props.query,
      rect: props.clientRect?.() ?? null,
      pick: (item) => props.command(item),
    });

  return () => ({
    onStart: sync,
    onUpdate: sync,
    onExit: () => store().hide(),
    onKeyDown: ({ event }: SuggestionKeyDownProps) => {
      const { items, index, pick, setIndex, hide } = store();
      if (event.key === 'Escape') {
        hide();
        return true;
      }
      if (!items.length) return false;
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
  });
}
