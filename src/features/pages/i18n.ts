import { createTranslation } from '@/lib/i18n/create-translation';

// Pages feature copy: sidebar, page tree, page view and the workspace home.
const en = {
  newPage: 'New page',
  pages: 'Pages',
  untitled: 'Untitled',
  addSubpage: 'Add a page inside',
  expand: 'Expand',
  collapse: 'Collapse',
  titlePlaceholder: 'Untitled',
  actions: { label: 'Page actions', duplicate: 'Duplicate', moveToTrash: 'Move to trash' },
  trash: {
    title: 'Trash',
    description: 'Pages here can be restored, or deleted for good.',
    empty: 'The trash is empty.',
    restore: 'Restore',
    deleteForever: 'Delete forever',
    confirmDelete: (title: string) => `Delete "${title}" and its subpages for good?`,
    deletedAgo: (when: string) => `Deleted ${when}`,
  },
  notFound: {
    title: 'Page not found',
    description: 'It may have been moved to the trash.',
  },
  home: {
    emptyTitle: 'Your nook is empty',
    emptyDescription: 'Create a first page to start writing, planning or drawing.',
    pickTitle: 'Pick a page',
    pickDescription: 'Choose a page in the sidebar, or create a new one.',
  },
};

const pl: typeof en = {
  newPage: 'Nowa strona',
  pages: 'Strony',
  untitled: 'Bez tytułu',
  addSubpage: 'Dodaj stronę w środku',
  expand: 'Rozwiń',
  collapse: 'Zwiń',
  titlePlaceholder: 'Bez tytułu',
  actions: { label: 'Akcje strony', duplicate: 'Duplikuj', moveToTrash: 'Przenieś do kosza' },
  trash: {
    title: 'Kosz',
    description: 'Strony z kosza możesz przywrócić albo usunąć na zawsze.',
    empty: 'Kosz jest pusty.',
    restore: 'Przywróć',
    deleteForever: 'Usuń na zawsze',
    confirmDelete: (title: string) => `Usunąć „${title}” i jej podstrony na zawsze?`,
    deletedAgo: (when: string) => `Usunięto ${when}`,
  },
  notFound: {
    title: 'Nie znaleziono strony',
    description: 'Mogła zostać przeniesiona do kosza.',
  },
  home: {
    emptyTitle: 'Twój nook jest pusty',
    emptyDescription: 'Utwórz pierwszą stronę, żeby zacząć pisać, planować albo rysować.',
    pickTitle: 'Wybierz stronę',
    pickDescription: 'Wybierz stronę w sidebarze albo utwórz nową.',
  },
};

export const usePagesTranslation = createTranslation({ en, pl });
