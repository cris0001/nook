import { createTranslation } from './create-translation';

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
  profile: {
    label: 'Profile and settings',
    you: 'You',
    namePlaceholder: 'Your name',
    viewAs: 'View as',
    themeLabel: 'Theme',
  },
  role: {
    names: { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' },
    descriptions: {
      owner: 'Full access, including database structure',
      editor: 'Edits pages and records, not structure',
      viewer: 'Read-only',
    },
  },
  readOnly: 'View only',
  errors: {
    saveFailed: 'A change could not be saved. Try again, or reload the page.',
    storageFull: 'Browser storage is full — free some space so changes can be saved.',
    screenTitle: 'Something broke on this screen',
    screenBody: 'Your workspace is stored safely in this browser. Reloading usually fixes it.',
    reload: 'Reload',
  },
  due: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    inDays: (n: number) => `In ${n} days`,
    late: (n: number) => (n === 1 ? '1 day late' : `${n} days late`),
  },
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
  profile: {
    label: 'Profil i ustawienia',
    you: 'Ty',
    namePlaceholder: 'Twoje imię',
    viewAs: 'Widok jako',
    themeLabel: 'Motyw',
  },
  role: {
    names: { owner: 'Właściciel', editor: 'Edytor', viewer: 'Czytelnik' },
    descriptions: {
      owner: 'Pełny dostęp, także do struktury baz',
      editor: 'Edytuje strony i rekordy, nie strukturę',
      viewer: 'Tylko do odczytu',
    },
  },
  readOnly: 'Tylko podgląd',
  errors: {
    saveFailed: 'Nie udało się zapisać zmiany. Spróbuj ponownie albo odśwież stronę.',
    storageFull: 'Pamięć przeglądarki jest pełna — zwolnij miejsce, żeby zapisywać zmiany.',
    screenTitle: 'Coś się zepsuło na tym ekranie',
    screenBody:
      'Twoja przestrzeń jest bezpiecznie zapisana w przeglądarce. Odświeżenie zwykle pomaga.',
    reload: 'Odśwież',
  },
  due: {
    today: 'Dziś',
    tomorrow: 'Jutro',
    inDays: (n: number) => `Za ${n} dni`,
    late: (n: number) => (n === 1 ? '1 dzień po terminie' : `${n} dni po terminie`),
  },
};

export const useCommonTranslation = createTranslation({ en, pl });
