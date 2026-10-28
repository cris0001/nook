import { z } from 'zod';

import { ContentSchema } from './content.schema';
import { DashboardSchema } from './dashboard.schema';
import { DatabaseSchema, ViewSchema } from './database.schema';
import { PageSchema } from './page.schema';

export const BACKUP_VERSION = 1;

export const BackupSchema = z.object({
  format: z.literal('nook'),
  version: z.literal(BACKUP_VERSION),
  exportedAt: z.number(),
  pages: z.array(PageSchema),
  databases: z.array(DatabaseSchema),
  views: z.array(ViewSchema),
  contents: z.array(ContentSchema),
  dashboards: z.array(DashboardSchema).default([]),
});

export type Backup = z.infer<typeof BackupSchema>;
