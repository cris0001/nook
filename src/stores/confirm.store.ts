import { create } from 'zustand';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  destructive?: boolean;
}

// Promise-based confirmation backed by one app-wide dialog: `await confirm({...})`
// resolves true/false when the user answers. Replaces window.confirm, which can't be
// styled or translated and blocks the page.
interface ConfirmState {
  options: ConfirmOptions | null;
  resolve: ((ok: boolean) => void) | null;
  ask: (options: ConfirmOptions) => Promise<boolean>;
  answer: (ok: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  options: null,
  resolve: null,
  ask: (options) =>
    new Promise<boolean>((resolve) => {
      get().resolve?.(false);
      set({ options, resolve });
    }),
  answer: (ok) => {
    get().resolve?.(ok);
    set({ options: null, resolve: null });
  },
}));

export const useConfirm = () => useConfirmStore((s) => s.ask);
