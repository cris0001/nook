import { ChartColumn, Database, File, FileText, PenTool, type LucideIcon } from 'lucide-react';

import type { PageType } from '@/schemas/page.schema';

export const PAGE_TYPE_ICON: Record<PageType, LucideIcon> = {
  document: FileText,
  database: Database,
  record: File,
  whiteboard: PenTool,
  dashboard: ChartColumn,
};
