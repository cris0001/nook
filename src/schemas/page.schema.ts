import { z } from 'zod';

import { PropertyValueSchema } from './database.schema';

// 'record' is a row of a database: a full page (title, icon, content) whose parent is
// the database page and whose cell values live in `properties`. Records never show in
// the sidebar tree — they're reached through their database.
export const PAGE_TYPES = ['document', 'database', 'record', 'whiteboard', 'dashboard'] as const;

export const PageTypeSchema = z.enum(PAGE_TYPES);

// A page in the workspace tree. Only tree metadata lives here — each type keeps its
// content (document blocks, whiteboard shapes, …) in its own table, so the sidebar
// loads light rows. Timestamps are epoch ms; a null `deletedAt` means not in trash.
export const PageSchema = z.object({
  id: z.uuid(),
  parentId: z.uuid().nullable(),
  type: PageTypeSchema,
  title: z.string().max(200),
  icon: z.string().nullable(),
  // Fractional index: sorts lexicographically among siblings, so moving a page only
  // rewrites that page's key instead of renumbering its neighbours.
  order: z.string().min(1),
  // Cell values by property id. Empty for every page type except records.
  properties: z.record(z.string(), PropertyValueSchema),
  favoritedAt: z.number().nullable(),
  lastOpenedAt: z.number().nullable(),
  deletedAt: z.number().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type PageType = z.infer<typeof PageTypeSchema>;
export type Page = z.infer<typeof PageSchema>;
