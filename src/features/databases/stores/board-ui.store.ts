import { create } from 'zustand';

import type { CardTarget } from '../utils/board';

// Ephemeral board UI state: the card being dragged and where it would land (drives the
// drop line), plus the card whose title is being typed right after "Add a card".
interface BoardUiState {
  draggingId: string | null;
  target: CardTarget | null;
  editingId: string | null;
  startDrag: (id: string) => void;
  setTarget: (target: CardTarget | null) => void;
  endDrag: () => void;
  setEditing: (id: string | null) => void;
}

export const useBoardUiStore = create<BoardUiState>((set) => ({
  draggingId: null,
  target: null,
  editingId: null,
  startDrag: (id) => set({ draggingId: id, target: null }),
  setTarget: (target) => set({ target }),
  endDrag: () => set({ draggingId: null, target: null }),
  setEditing: (editingId) => set({ editingId }),
}));
