import type { Editor } from '@tiptap/react';
import {
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListChecks,
  ListOrdered,
  Pilcrow,
  Quote,
  type LucideIcon,
} from 'lucide-react';

import type { SlashItemId } from './slash-items';

export type BlockTypeId = Exclude<SlashItemId, 'divider'>;

export interface BlockType {
  id: BlockTypeId;
  Icon: LucideIcon;
  isActive: (editor: Editor) => boolean;
  apply: (editor: Editor) => void;
}

const chain = (editor: Editor) => editor.chain().focus().clearNodes();

export const BLOCK_TYPES: BlockType[] = [
  {
    id: 'text',
    Icon: Pilcrow,
    isActive: (e) =>
      e.isActive('paragraph') &&
      !e.isActive('listItem') &&
      !e.isActive('taskItem') &&
      !e.isActive('blockquote'),
    apply: (e) => chain(e).setParagraph().run(),
  },
  ...([1, 2, 3] as const).map((level): BlockType => ({
    id: `heading${level}`,
    Icon: [Heading1, Heading2, Heading3][level - 1] ?? Heading1,
    isActive: (e) => e.isActive('heading', { level }),
    apply: (e) => chain(e).setHeading({ level }).run(),
  })),
  {
    id: 'bulletList',
    Icon: List,
    isActive: (e) => e.isActive('bulletList'),
    apply: (e) => chain(e).toggleBulletList().run(),
  },
  {
    id: 'orderedList',
    Icon: ListOrdered,
    isActive: (e) => e.isActive('orderedList'),
    apply: (e) => chain(e).toggleOrderedList().run(),
  },
  {
    id: 'taskList',
    Icon: ListChecks,
    isActive: (e) => e.isActive('taskList'),
    apply: (e) => chain(e).toggleTaskList().run(),
  },
  {
    id: 'quote',
    Icon: Quote,
    isActive: (e) => e.isActive('blockquote'),
    apply: (e) => chain(e).toggleBlockquote().run(),
  },
  {
    id: 'code',
    Icon: Code2,
    isActive: (e) => e.isActive('codeBlock'),
    apply: (e) => chain(e).toggleCodeBlock().run(),
  },
];
