import { create } from 'zustand';

interface CalendarUiState {
  draggingId: string | null;
  overDay: string | null;
  editingId: string | null;
  setDragging: (id: string | null) => void;
  setOverDay: (day: string | null) => void;
  setEditing: (id: string | null) => void;
}

export const useCalendarUiStore = create<CalendarUiState>((set) => ({
  draggingId: null,
  overDay: null,
  editingId: null,
  setDragging: (draggingId) => set({ draggingId, overDay: null }),
  setOverDay: (overDay) => set({ overDay }),
  setEditing: (editingId) => set({ editingId }),
}));
