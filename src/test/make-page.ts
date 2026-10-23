import type { Page } from '@/schemas/page.schema';

// A complete page row for unit tests; the id doubles as the title so assertions read
// naturally. Override just the fields a test cares about.
export function makePage(id: string, parentId: string | null, overrides: Partial<Page> = {}): Page {
  return {
    id,
    parentId,
    type: 'document',
    title: id,
    icon: null,
    order: 'a0',
    properties: {},
    favoritedAt: null,
    lastOpenedAt: null,
    deletedAt: null,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}
