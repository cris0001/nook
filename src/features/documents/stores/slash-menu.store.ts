import { create } from 'zustand';

import type { SlashItem } from '../utils/slash-items';

// Bridge between the "/" suggestion plugin (plain callbacks inside the editor) and the
// React menu: the plugin writes what's open and where, the menu reads it. `pick` is
// set by the plugin and runs the chosen item against the current "/query" range.
interface SlashMenuState {
  open: boolean;
  query: string;
  rect: DOMRect | null;
  index: number;
  pick: ((item: SlashItem) => void) | null;
  // The menu's current filtered list, published by the menu for keyboard handling.
  items: SlashItem[];
  setItems: (items: SlashItem[]) => void;
  show: (patch: { query: string; rect: DOMRect | null; pick: (item: SlashItem) => void }) => void;
  setIndex: (index: number) => void;
  hide: () => void;
}

export const useSlashMenuStore = create<SlashMenuState>((set) => ({
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
