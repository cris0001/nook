import { z } from 'zod';

import { PropertyValueSchema } from './database.schema';

export const PAGE_TYPES = ['document', 'database', 'record', 'whiteboard', 'dashboard'] as const;

export const PageTypeSchema = z.enum(PAGE_TYPES);

export const PageSchema = z.object({
  id: z.uuid(),
  parentId: z.uuid().nullable(),
  type: PageTypeSchema,
  title: z.string().max(200),
  icon: z.string().nullable(),
  // Fractional index: sorts lexicographically among siblings, so moving a page only
  // rewrites that page's key instead of renumbering its neighbours.
  order: z.string().min(1),
  properties: z.record(z.string(), PropertyValueSchema),
  favoritedAt: z.number().nullable(),
  lastOpenedAt: z.number().nullable(),
  deletedAt: z.number().nullable(),
  // When a record last reached the done stage; null once it leaves it. Missing on rows
  // from before it was tracked.
  doneAt: z.number().nullable().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type PageType = z.infer<typeof PageTypeSchema>;
export type Page = z.infer<typeof PageSchema>;
