import type { JSONContent } from '@tiptap/react';

const text = (value: string): JSONContent[] => (value ? [{ type: 'text', text: value }] : []);

export const doc = (...content: JSONContent[]): JSONContent => ({ type: 'doc', content });
export const p = (value: string): JSONContent => ({ type: 'paragraph', content: text(value) });
export const h = (level: 1 | 2 | 3, value: string): JSONContent => ({
  type: 'heading',
  attrs: { level },
  content: text(value),
});
export const bullets = (items: string[]): JSONContent => ({
  type: 'bulletList',
  content: items.map((item) => ({ type: 'listItem', content: [p(item)] })),
});
export const todos = (items: [string, boolean][]): JSONContent => ({
  type: 'taskList',
  content: items.map(([item, checked]) => ({
    type: 'taskItem',
    attrs: { checked },
    content: [p(item)],
  })),
});
export const quote = (value: string): JSONContent => ({ type: 'blockquote', content: [p(value)] });
