import { createTranslation } from './create-translation';

// Copy for shared, feature-agnostic chrome (app shell, toggles).
const en = {
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  language: 'Language',
  theme: { system: 'System theme', light: 'Light theme', dark: 'Dark theme' },
  cancel: 'Cancel',
  delete: 'Delete',
  undo: 'Undo',
  untitled: 'Untitled',
  movedToTrash: (title: string) => `"${title}" moved to the trash`,
};

const pl: typeof en = {
  openMenu: 'Otwórz menu',
  closeMenu: 'Zamknij menu',
  language: 'Język',
  theme: { system: 'Motyw systemowy', light: 'Motyw jasny', dark: 'Motyw ciemny' },
  cancel: 'Anuluj',
  delete: 'Usuń',
  undo: 'Cofnij',
  untitled: 'Bez tytułu',
  movedToTrash: (title: string) => `„${title}” przeniesiono do kosza`,
};

export const useCommonTranslation = createTranslation({ en, pl });
