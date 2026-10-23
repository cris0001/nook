import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { DropPosition } from '../utils/plan-drop';

export interface DropTarget {
  id: string;
  position: DropPosition;
}

interface SidebarUiState {
  expanded: string[];
  draggingId: string | null;
  dropTarget: DropTarget | null;
  renamingId: string | null;
  setRenaming: (id: string | null) => void;
  toggle: (id: string) => void;
  expand: (id: string) => void;
  startDrag: (id: string) => void;
  setDropTarget: (target: DropTarget | null) => void;
  endDrag: () => void;
}

export const useSidebarUiStore = create<SidebarUiState>()(
  persist(
    (set) => ({
      expanded: [],
      draggingId: null,
      dropTarget: null,
      renamingId: null,
      setRenaming: (renamingId) => set({ renamingId }),
      toggle: (id) =>
        set((s) => ({
          expanded: s.expanded.includes(id)
            ? s.expanded.filter((x) => x !== id)
            : [...s.expanded, id],
        })),
      expand: (id) => set((s) => (s.expanded.includes(id) ? s : { expanded: [...s.expanded, id] })),
      startDrag: (id) => set({ draggingId: id, dropTarget: null }),
      setDropTarget: (dropTarget) => set({ dropTarget }),
      endDrag: () => set({ draggingId: null, dropTarget: null }),
    }),
    { name: 'nook-sidebar', partialize: (s) => ({ expanded: s.expanded }) },
  ),
);
