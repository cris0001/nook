import { z } from 'zod';

export const PAGE_TYPES = ['document', 'database', 'whiteboard', 'dashboard'] as const;

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
  favoritedAt: z.number().nullable(),
  lastOpenedAt: z.number().nullable(),
  deletedAt: z.number().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type PageType = z.infer<typeof PageTypeSchema>;
export type Page = z.infer<typeof PageSchema>;
