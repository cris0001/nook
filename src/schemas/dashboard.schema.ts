import { z } from 'zod';

// One row per dashboard page (same id): which database its charts read.
export const DashboardSchema = z.object({
  id: z.uuid(),
  sourceId: z.uuid().nullable(),
});

export type Dashboard = z.infer<typeof DashboardSchema>;
