import { create } from 'zustand';

const HAPPY_MS = 2200;

interface BrandMoodState {
  happy: boolean;
  celebrate: () => void;
}

let timer = 0;

export const useBrandMoodStore = create<BrandMoodState>()((set) => ({
  happy: false,
  celebrate: () => {
    window.clearTimeout(timer);
    set({ happy: true });
    timer = window.setTimeout(() => set({ happy: false }), HAPPY_MS);
  },
}));
