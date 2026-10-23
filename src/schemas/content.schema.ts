import { z } from 'zod';

// A page's rich-text body, one row per page (same id). `doc` is the editor's JSON
// document; it's validated as plain JSON here and shaped by the editor schema.
export const ContentSchema = z.object({
  id: z.uuid(),
  doc: z.json(),
  updatedAt: z.number(),
});

export type Content = z.infer<typeof ContentSchema>;
