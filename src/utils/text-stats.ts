import type { JSONContent } from '@tiptap/react';

const WORDS_PER_MINUTE = 220;

function collectText(node: JSONContent, out: string[]): void {
  if (node.text) out.push(node.text);
  for (const child of node.content ?? []) {
    collectText(child, out);
    out.push(' ');
  }
}

export function textStats(doc: JSONContent | null | undefined): { words: number; minutes: number } {
  if (!doc) return { words: 0, minutes: 0 };
  const parts: string[] = [];
  collectText(doc, parts);
  const words = parts.join('').match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return { words, minutes: words ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : 0 };
}
