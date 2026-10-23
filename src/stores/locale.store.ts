import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The UI language. Only interface copy is translated — page titles and content stay
// exactly as the user typed them.
export type Locale = 'en' | 'pl';

// Language names are written in their own language, so each is findable by its speakers.
export const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pl', label: 'PL', name: 'Polski' },
];

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

// Persisted so the choice survives reloads. Defaults to English.
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'nook-locale' },
  ),
);
