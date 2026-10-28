import { useEffect, useMemo } from 'react';

import { renamePage } from '@/lib/data/pages';
import { debounce } from '@/utils/debounce';

const RENAME_DELAY_MS = 250;

// Every write to `pages` re-runs each live query over the table (sidebar, Today,
// progress), so titles are written after a short pause instead of on every keystroke.
export function useDebouncedRename(pageId: string) {
  const rename = useMemo(
    () => debounce((title: string) => void renamePage(pageId, title), RENAME_DELAY_MS),
    [pageId],
  );
  useEffect(() => {
    const flush = () => rename.flush();
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [rename]);
  return rename;
}
