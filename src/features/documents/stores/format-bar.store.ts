import { create } from 'zustand';

interface FormatBarState {
  editingLink: boolean;
  setEditingLink: (editing: boolean) => void;
}

export const useFormatBarStore = create<FormatBarState>()((set) => ({
  editingLink: false,
  setEditingLink: (editingLink) => set({ editingLink }),
}));
