import { create } from 'zustand';

export type FormatBarMode = 'marks' | 'link' | 'color' | 'turnInto';

interface FormatBarState {
  mode: FormatBarMode;
  setMode: (mode: FormatBarMode) => void;
}

export const useFormatBarStore = create<FormatBarState>()((set) => ({
  mode: 'marks',
  setMode: (mode) => set({ mode }),
}));
