import { z } from 'zod';

// A mention of `targetId` inside the document of `sourceId`. Derived from document
// bodies on every save — an index for backlinks, never edited on its own.
export const LinkSchema = z.object({
  id: z.string().min(1),
  sourceId: z.uuid(),
  targetId: z.uuid(),
});

export type Link = z.infer<typeof LinkSchema>;
