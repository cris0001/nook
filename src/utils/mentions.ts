import type { JSONContent } from '@tiptap/react';

export const MENTION_NODE = 'mention';

export function mentionTargets(doc: JSONContent | null | undefined): string[] {
  const found = new Set<string>();
  const walk = (node: JSONContent) => {
    const id: unknown = node.attrs?.id;
    if (node.type === MENTION_NODE && typeof id === 'string') found.add(id);
    node.content?.forEach(walk);
  };
  if (doc) walk(doc);
  return [...found];
}
