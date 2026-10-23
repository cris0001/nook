import type { OptionColor } from '@/schemas/database.schema';

// Tag classes per option color. Spelled out in full (not built from the color name)
// so Tailwind can see every class at build time.
export const OPTION_STYLE: Record<OptionColor, string> = {
  gray: 'bg-(--tag-gray-bg) text-(--tag-gray-fg)',
  brown: 'bg-(--tag-brown-bg) text-(--tag-brown-fg)',
  orange: 'bg-(--tag-orange-bg) text-(--tag-orange-fg)',
  yellow: 'bg-(--tag-yellow-bg) text-(--tag-yellow-fg)',
  green: 'bg-(--tag-green-bg) text-(--tag-green-fg)',
  blue: 'bg-(--tag-blue-bg) text-(--tag-blue-fg)',
  purple: 'bg-(--tag-purple-bg) text-(--tag-purple-fg)',
  pink: 'bg-(--tag-pink-bg) text-(--tag-pink-fg)',
  red: 'bg-(--tag-red-bg) text-(--tag-red-fg)',
};

export const DOT_STYLE: Record<OptionColor, string> = {
  gray: 'bg-(--dot-gray)',
  brown: 'bg-(--dot-brown)',
  orange: 'bg-(--dot-orange)',
  yellow: 'bg-(--dot-yellow)',
  green: 'bg-(--dot-green)',
  blue: 'bg-(--dot-blue)',
  purple: 'bg-(--dot-purple)',
  pink: 'bg-(--dot-pink)',
  red: 'bg-(--dot-red)',
};
