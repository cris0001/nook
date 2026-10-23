import { createTranslation } from '@/lib/i18n/create-translation';

import type { PropertyType, ViewType } from '@/schemas/database.schema';

// Databases feature copy: views, table, properties, cells.
const en = {
  name: 'Name',
  untitled: 'Untitled',
  newRecord: 'New',
  open: 'Open',
  views: 'Views',
  viewType: { table: 'Table', board: 'Board', calendar: 'Calendar' } satisfies Record<
    ViewType,
    string
  >,
  comingSoon: 'This view arrives in the next step.',
  addProperty: 'Add a property',
  propertyName: 'Property name',
  propertyType: {
    text: 'Text',
    number: 'Number',
    select: 'Select',
    multiSelect: 'Multi-select',
    date: 'Date',
    checkbox: 'Checkbox',
    url: 'URL',
  } satisfies Record<PropertyType, string>,
  deleteProperty: 'Delete property',
  confirmDeleteProperty: (name: string) => `Delete the "${name}" property and its values?`,
  searchOrCreate: 'Search or create…',
  createOption: (name: string) => `Create "${name}"`,
  empty: 'Empty',
  noRecords: 'No records yet.',
};

const pl: typeof en = {
  name: 'Nazwa',
  untitled: 'Bez tytułu',
  newRecord: 'Nowy',
  open: 'Otwórz',
  views: 'Widoki',
  viewType: { table: 'Tabela', board: 'Tablica', calendar: 'Kalendarz' },
  comingSoon: 'Ten widok pojawi się w następnym kroku.',
  addProperty: 'Dodaj właściwość',
  propertyName: 'Nazwa właściwości',
  propertyType: {
    text: 'Tekst',
    number: 'Liczba',
    select: 'Wybór',
    multiSelect: 'Wielokrotny wybór',
    date: 'Data',
    checkbox: 'Checkbox',
    url: 'URL',
  },
  deleteProperty: 'Usuń właściwość',
  confirmDeleteProperty: (name: string) => `Usunąć właściwość „${name}” i jej wartości?`,
  searchOrCreate: 'Szukaj lub utwórz…',
  createOption: (name: string) => `Utwórz „${name}”`,
  empty: 'Puste',
  noRecords: 'Brak rekordów.',
};

export const useDatabasesTranslation = createTranslation({ en, pl });
