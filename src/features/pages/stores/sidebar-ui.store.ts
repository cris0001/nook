import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { DropPosition } from '../utils/plan-drop';

export interface DropTarget {
  id: string;
  position: DropPosition;
}

// Sidebar UI state. `expanded` is persisted so the tree opens the way it was left;
// the drag fields are ephemeral and only live during a drag. Kept in one store so a
// drop "inside" can expand its target in the same update.
interface SidebarUiState {
  expanded: string[];
  draggingId: string | null;
  dropTarget: DropTarget | null;
  // The page whose title is being edited in place in the tree.
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
