import { useLiveQuery } from 'dexie-react-hooks';

import { getDatabase } from '@/lib/data/databases';
import { getPage } from '@/lib/data/pages';
import type { SelectOption } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { statusPropertyOf } from '@/utils/progress';

export interface MentionTarget {
  page: Page | null;
  status: { option: SelectOption; done: boolean } | null;
}

export function useMentionTarget(id: string): MentionTarget | undefined {
  return useLiveQuery(async () => {
    const page = await getPage(id);
    if (page?.deletedAt !== null) return { page: null, status: null };
    if (page.type !== 'record' || !page.parentId) return { page, status: null };
    const database = await getDatabase(page.parentId);
    const status = database && statusPropertyOf(database);
    const option = status?.options.find((o) => o.id === page.properties[status.id]);
    return {
      page,
      status: option ? { option, done: option.id === status?.options.at(-1)?.id } : null,
    };
  }, [id]);
}
