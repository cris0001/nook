import { OPTION_COLORS, type OptionColor } from '@/schemas/database.schema';

export const TEXT_COLORS: readonly OptionColor[] = OPTION_COLORS;

// Stored in the document as a CSS variable, not a hex value, so colored text and
// highlights follow the theme (the same tokens as database tags).
export const textColor = (color: OptionColor) => `var(--tag-${color}-fg)`;
export const highlightColor = (color: OptionColor) => `var(--tag-${color}-bg)`;
