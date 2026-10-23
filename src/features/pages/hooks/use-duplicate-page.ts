import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import { duplicatePage } from '@/lib/data/pages';

export function useDuplicatePage() {
  const navigate = useNavigate();
  return useCallback(
    async (id: string) => {
      const copy = await duplicatePage(id);
      if (copy) {
        await navigate({ to: '/p/$pageId', params: { pageId: copy.id } });
      }
    },
    [navigate],
  );
}
