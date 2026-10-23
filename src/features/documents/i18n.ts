import { createTranslation } from '@/lib/i18n/create-translation';

import type { SlashItemId } from './utils/slash-items';

// Documents feature copy: editor placeholder, slash menu, block handle.
const en = {
  placeholder: "Write something, or press '/' for blocks…",
  emptyHeading: 'Heading',
  noMatches: 'No matching blocks',
  dragBlock: 'Drag to move',
  blocks: {
    text: ['Text', 'Plain paragraph'],
    heading1: ['Heading 1', 'Big section title'],
    heading2: ['Heading 2', 'Medium section title'],
    heading3: ['Heading 3', 'Small section title'],
    bulletList: ['Bulleted list', 'Simple list'],
    orderedList: ['Numbered list', 'List with numbers'],
    taskList: ['To-do list', 'Track tasks with checkboxes'],
    quote: ['Quote', 'Call out a quote'],
    code: ['Code', 'Code block'],
    divider: ['Divider', 'Separate sections'],
  } satisfies Record<SlashItemId, [string, string]>,
};

const pl: typeof en = {
  placeholder: "Napisz coś albo wciśnij '/', żeby wstawić blok…",
  emptyHeading: 'Nagłówek',
  noMatches: 'Brak pasujących bloków',
  dragBlock: 'Przeciągnij, aby przenieść',
  blocks: {
    text: ['Tekst', 'Zwykły akapit'],
    heading1: ['Nagłówek 1', 'Duży tytuł sekcji'],
    heading2: ['Nagłówek 2', 'Średni tytuł sekcji'],
    heading3: ['Nagłówek 3', 'Mały tytuł sekcji'],
    bulletList: ['Lista punktowana', 'Prosta lista'],
    orderedList: ['Lista numerowana', 'Lista z numerami'],
    taskList: ['Lista zadań', 'Zadania z checkboxami'],
    quote: ['Cytat', 'Wyróżniony cytat'],
    code: ['Kod', 'Blok kodu'],
    divider: ['Separator', 'Oddziel sekcje'],
  },
};

export const useDocumentsTranslation = createTranslation({ en, pl });
