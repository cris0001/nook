import { create } from 'zustand';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  destructive?: boolean;
}

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
