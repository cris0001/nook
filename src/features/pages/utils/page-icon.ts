import { ChartColumn, Database, File, FileText, PenTool, type LucideIcon } from 'lucide-react';

import type { PageType } from '@/schemas/page.schema';

// Fallback icon per page type, shown when a page has no emoji of its own.
export const PAGE_TYPE_ICON: Record<PageType, LucideIcon> = {
  document: FileText,
  database: Database,
  record: File,
  whiteboard: PenTool,
  dashboard: ChartColumn,
};
