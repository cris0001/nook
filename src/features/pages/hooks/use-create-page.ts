import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import { createDatabase } from '@/lib/data/databases';
import { createPage, type CreatePageInput } from '@/lib/data/pages';

// Creates a page and opens it straight away, like Notion does. Databases go through
// createDatabase so they start with columns and views.
export function useCreatePage() {
  const navigate = useNavigate();
  return useCallback(
    async (input: CreatePageInput) => {
      const page =
        input.type === 'database'
          ? await createDatabase(input.parentId, input.title)
          : await createPage(input);
      await navigate({ to: '/p/$pageId', params: { pageId: page.id } });
      return page;
    },
    [navigate],
  );
}
