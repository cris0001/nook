import { create } from 'zustand';

import type { BoardElement, Ink, StrokeWidth } from '@/schemas/scene.schema';

import type { Camera } from '../utils/geometry';

export type Tool =
  'select' | 'hand' | 'pen' | 'rectangle' | 'ellipse' | 'arrow' | 'line' | 'text' | 'eraser';

export interface Style {
  stroke: Ink;
  fill: Ink | null;
  strokeWidth: StrokeWidth;
}

const HISTORY_LIMIT = 100;

interface WhiteboardState {
  elements: BoardElement[];
  selected: string[];
  tool: Tool;
  style: Style;
  camera: Camera;
  editingTextId: string | null;
  past: BoardElement[][];
  future: BoardElement[][];
  load: (elements: BoardElement[]) => void;
  // Live changes during a gesture; `commit` records the state before it for undo.
  preview: (elements: BoardElement[]) => void;
  commit: (before: BoardElement[], after?: BoardElement[]) => void;
  undo: () => void;
  redo: () => void;
  setTool: (tool: Tool) => void;
  setStyle: (style: Partial<Style>) => void;
  select: (ids: string[]) => void;
  setCamera: (camera: Camera) => void;
  setEditingText: (id: string | null) => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set, get) => ({
  elements: [],
  selected: [],
  tool: 'select',
  style: { stroke: 'ink', fill: null, strokeWidth: 2 },
  camera: { x: 0, y: 0, zoom: 1 },
  editingTextId: null,
  past: [],
  future: [],
  load: (elements) =>
    set({
      elements,
      selected: [],
      past: [],
      future: [],
      editingTextId: null,
      camera: { x: 0, y: 0, zoom: 1 },
    }),
  preview: (elements) => set({ elements }),
  commit: (before, after) =>
    set((s) => ({
      elements: after ?? s.elements,
      past: [...s.past, before].slice(-HISTORY_LIMIT),
      future: [],
    })),
  undo: () => {
    const { past, elements, future } = get();
    const previous = past.at(-1);
    if (!previous) return;
    set({
      elements: previous,
      past: past.slice(0, -1),
      future: [elements, ...future],
      selected: [],
    });
  },
  redo: () => {
    const { past, elements, future } = get();
    const [next, ...rest] = future;
    if (!next) return;
    set({ elements: next, past: [...past, elements], future: rest, selected: [] });
  },
  setTool: (tool) => set({ tool, selected: tool === 'select' ? get().selected : [] }),
  setStyle: (style) => {
    const { selected, elements } = get();
    const next = { ...get().style, ...style };
    set({ style: next });
    if (selected.length === 0) return;
    const restyled = elements.map((element) => {
      if (!selected.includes(element.id)) return element;
      const fill = 'fill' in element && style.fill !== undefined ? { fill: style.fill } : {};
      return {
        ...element,
        ...(style.stroke ? { stroke: style.stroke } : {}),
        ...(style.strokeWidth ? { strokeWidth: style.strokeWidth } : {}),
        ...fill,
      };
    });
    get().commit(elements, restyled);
  },
  select: (selected) => set({ selected }),
  setCamera: (camera) => set({ camera }),
  setEditingText: (editingTextId) => set({ editingTextId }),
}));
