import { getDatabase, listRecords } from '@/lib/data/databases';
import { listPages } from '@/lib/data/pages';

import type { AgendaSource } from '../utils/agenda';

export async function loadAgendaSources(): Promise<AgendaSource[]> {
  const pages = (await listPages()).filter((page) => page.type === 'database');
  const sources = await Promise.all(
    pages.map(async (page) => {
      const [database, records] = await Promise.all([getDatabase(page.id), listRecords(page.id)]);
      return database ? { page, database, records } : null;
    }),
  );
  return sources.filter((source) => source !== null);
}
