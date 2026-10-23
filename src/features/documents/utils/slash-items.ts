import type { Editor, Range } from '@tiptap/react';
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  type LucideIcon,
} from 'lucide-react';

export type SlashItemId =
  | 'text'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'quote'
  | 'code'
  | 'divider';

export interface SlashItem {
  id: SlashItemId;
  icon: LucideIcon;
  keywords: string;
  run: (editor: Editor, range: Range) => void;
}

export const SLASH_ITEMS: SlashItem[] = [
  {
    id: 'text',
    icon: Pilcrow,
    keywords: 'paragraph p akapit',
    run: (e, r) => e.chain().focus().deleteRange(r).setParagraph().run(),
  },
  {
    id: 'heading1',
    icon: Heading1,
    keywords: 'h1 title tytul',
    run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 1 }).run(),
  },
  {
    id: 'heading2',
    icon: Heading2,
    keywords: 'h2 subtitle',
    run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 2 }).run(),
  },
  {
    id: 'heading3',
    icon: Heading3,
    keywords: 'h3',
    run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 3 }).run(),
  },
  {
    id: 'bulletList',
    icon: List,
    keywords: 'ul bullets punkty',
    run: (e, r) => e.chain().focus().deleteRange(r).toggleBulletList().run(),
  },
  {
    id: 'orderedList',
    icon: ListOrdered,
    keywords: 'ol numbers numery',
    run: (e, r) => e.chain().focus().deleteRange(r).toggleOrderedList().run(),
  },
  {
    id: 'taskList',
    icon: CheckSquare,
    keywords: 'todo checkbox task zadania',
    run: (e, r) => e.chain().focus().deleteRange(r).toggleTaskList().run(),
  },
  {
    id: 'quote',
    icon: Quote,
    keywords: 'blockquote cytat',
    run: (e, r) => e.chain().focus().deleteRange(r).toggleBlockquote().run(),
  },
  {
    id: 'code',
    icon: Code,
    keywords: 'codeblock pre kod',
    run: (e, r) => e.chain().focus().deleteRange(r).toggleCodeBlock().run(),
  },
  {
    id: 'divider',
    icon: Minus,
    keywords: 'hr line rule linia separator',
    run: (e, r) => e.chain().focus().deleteRange(r).setHorizontalRule().run(),
  },
];

export function matchesQuery(haystack: string, query: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  return normalize(haystack).includes(normalize(query.trim()));
}
