import { createTranslation } from '@/lib/i18n/create-translation';
import type { Ink, StrokeWidth } from '@/schemas/scene.schema';

import type { Tool } from './stores/whiteboard.store';

const en = {
  tools: {
    select: 'Select',
    hand: 'Move around',
    pen: 'Pen',
    rectangle: 'Rectangle',
    ellipse: 'Ellipse',
    arrow: 'Arrow',
    line: 'Line',
    text: 'Text',
    eraser: 'Eraser',
  } satisfies Record<Tool, string>,
  undo: 'Undo',
  redo: 'Redo',
  stroke: 'Stroke',
  fill: 'Fill',
  noFill: 'No fill',
  width: 'Width',
  widths: { 1: 'Thin', 2: 'Medium', 4: 'Bold' } satisfies Record<StrokeWidth, string>,
  colors: {
    ink: 'Ink',
    gray: 'Gray',
    brown: 'Brown',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    blue: 'Blue',
    purple: 'Purple',
    pink: 'Pink',
    red: 'Red',
  } satisfies Record<Ink, string>,
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  resetZoom: 'Reset zoom',
  fit: 'Fit to drawing',
  export: 'Export as PNG',
  emptyHint: 'Pick a tool above and draw. Space + drag moves around, ⌘/Ctrl + scroll zooms.',
  emptyReadOnly: 'Nothing drawn yet.',
};

const pl: typeof en = {
  tools: {
    select: 'Zaznacz',
    hand: 'Przesuwaj widok',
    pen: 'Pisak',
    rectangle: 'Prostokąt',
    ellipse: 'Elipsa',
    arrow: 'Strzałka',
    line: 'Linia',
    text: 'Tekst',
    eraser: 'Gumka',
  },
  undo: 'Cofnij',
  redo: 'Ponów',
  stroke: 'Kontur',
  fill: 'Wypełnienie',
  noFill: 'Bez wypełnienia',
  width: 'Grubość',
  widths: { 1: 'Cienka', 2: 'Średnia', 4: 'Gruba' },
  colors: {
    ink: 'Atrament',
    gray: 'Szary',
    brown: 'Brązowy',
    orange: 'Pomarańczowy',
    yellow: 'Żółty',
    green: 'Zielony',
    blue: 'Niebieski',
    purple: 'Fioletowy',
    pink: 'Różowy',
    red: 'Czerwony',
  },
  zoomIn: 'Przybliż',
  zoomOut: 'Oddal',
  resetZoom: 'Resetuj powiększenie',
  fit: 'Dopasuj do rysunku',
  export: 'Eksportuj jako PNG',
  emptyHint:
    'Wybierz narzędzie u góry i rysuj. Spacja + przeciągnięcie przesuwa widok, ⌘/Ctrl + kółko przybliża.',
  emptyReadOnly: 'Nic tu jeszcze nie narysowano.',
};

export const useWhiteboardTranslation = createTranslation({ en, pl });
