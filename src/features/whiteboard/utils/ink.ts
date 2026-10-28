import type { Ink } from '@/schemas/scene.schema';

// Spelled out so Tailwind sees every class. 'ink' follows the text color.
export const INK_STROKE: Record<Ink, string> = {
  ink: 'stroke-foreground',
  gray: 'stroke-(--dot-gray)',
  brown: 'stroke-(--dot-brown)',
  orange: 'stroke-(--dot-orange)',
  yellow: 'stroke-(--dot-yellow)',
  green: 'stroke-(--dot-green)',
  blue: 'stroke-(--dot-blue)',
  purple: 'stroke-(--dot-purple)',
  pink: 'stroke-(--dot-pink)',
  red: 'stroke-(--dot-red)',
};

export const INK_FILL: Record<Ink, string> = {
  ink: 'fill-foreground',
  gray: 'fill-(--dot-gray)',
  brown: 'fill-(--dot-brown)',
  orange: 'fill-(--dot-orange)',
  yellow: 'fill-(--dot-yellow)',
  green: 'fill-(--dot-green)',
  blue: 'fill-(--dot-blue)',
  purple: 'fill-(--dot-purple)',
  pink: 'fill-(--dot-pink)',
  red: 'fill-(--dot-red)',
};

export const INK_BG: Record<Ink, string> = {
  ink: 'bg-foreground',
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

export const INK_TEXT: Record<Ink, string> = {
  ink: 'text-foreground',
  gray: 'text-(--dot-gray)',
  brown: 'text-(--dot-brown)',
  orange: 'text-(--dot-orange)',
  yellow: 'text-(--dot-yellow)',
  green: 'text-(--dot-green)',
  blue: 'text-(--dot-blue)',
  purple: 'text-(--dot-purple)',
  pink: 'text-(--dot-pink)',
  red: 'text-(--dot-red)',
};
