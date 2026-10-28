import { create } from 'zustand';

// Bridge between a Tiptap suggestion plugin (plain callbacks inside the editor) and a
// React menu: the plugin writes what's open and where, the menu publishes the items it
// shows, and `pick` (set by the plugin) runs one against the current trigger range.
export interface SuggestionState<T> {
  open: boolean;
  query: string;
  rect: DOMRect | null;
  index: number;
  pick: ((item: T) => void) | null;
  items: T[];
  setItems: (items: T[]) => void;
  show: (patch: { query: string; rect: DOMRect | null; pick: (item: T) => void }) => void;
  setIndex: (index: number) => void;
  hide: () => void;
}

export function createSuggestionStore<T>() {
  return create<SuggestionState<T>>((set) => ({
    open: false,
    query: '',
    rect: null,
    index: 0,
    pick: null,
    items: [],
    setItems: (items) => set({ items }),
    show: ({ query, rect, pick }) =>
      set((s) => ({ open: true, query, rect, pick, index: s.query === query ? s.index : 0 })),
    setIndex: (index) => set({ index }),
    hide: () => set({ open: false, query: '', rect: null, index: 0, pick: null }),
  }));
}
