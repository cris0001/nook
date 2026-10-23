import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import { createPage, type CreatePageInput } from '@/lib/data/pages';

// Creates a page and opens it straight away, like Notion does.
export function useCreatePage() {
  const navigate = useNavigate();
  return useCallback(
    async (input: CreatePageInput) => {
      const page = await createPage(input);
      await navigate({ to: '/p/$pageId', params: { pageId: page.id } });
      return page;
    },
    [navigate],
  );
}
