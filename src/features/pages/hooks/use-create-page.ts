import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import { createDatabase } from '@/lib/data/databases';
import { createPage, type CreatePageInput } from '@/lib/data/pages';

import { usePagesTranslation } from '../i18n';

export function useCreatePage() {
  const navigate = useNavigate();
  const t = usePagesTranslation();
  return useCallback(
    async (input: CreatePageInput) => {
      const page =
        input.type === 'database'
          ? await createDatabase(input.parentId, input.title, t.starterColumns)
          : await createPage(input);
      await navigate({ to: '/p/$pageId', params: { pageId: page.id } });
      return page;
    },
    [navigate, t],
  );
}
