import { z } from 'zod';

export const ContentSchema = z.object({
  id: z.uuid(),
  doc: z.json(),
  updatedAt: z.number(),
});

export type Content = z.infer<typeof ContentSchema>;
