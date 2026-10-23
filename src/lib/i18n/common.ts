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
  role: {
    label: 'Role',
    hint: 'Preview the workspace as a different role',
    names: { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' },
    descriptions: {
      owner: 'Full access, including database structure',
      editor: 'Edits pages and records, not structure',
      viewer: 'Read-only',
    },
  },
  readOnly: 'View only',
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
  role: {
    label: 'Rola',
    hint: 'Podejrzyj przestrzeń jako inna rola',
    names: { owner: 'Właściciel', editor: 'Edytor', viewer: 'Czytelnik' },
    descriptions: {
      owner: 'Pełny dostęp, także do struktury baz',
      editor: 'Edytuje strony i rekordy, nie strukturę',
      viewer: 'Tylko do odczytu',
    },
  },
  readOnly: 'Tylko podgląd',
};

export const useCommonTranslation = createTranslation({ en, pl });
