import type { JSONContent } from '@tiptap/react';
import { generateKeyBetween } from 'fractional-indexing';

import type { WorkspaceRows } from '@/lib/data/bulk';
import type {
  Database,
  OptionColor,
  PropertyDef,
  PropertyType,
  PropertyValue,
  SelectOption,
  View,
  ViewType,
} from '@/schemas/database.schema';
import type { Page, PageType } from '@/schemas/page.schema';
import type { BoardElement } from '@/schemas/scene.schema';

const id = () => crypto.randomUUID();

export const option = (name: string, color: OptionColor): SelectOption => ({
  id: id(),
  name,
  color,
});

export const property = (
  name: string,
  type: PropertyType,
  options: SelectOption[] = [],
): PropertyDef => ({
  id: id(),
  name,
  type,
  options,
});

interface PageInput {
  parentId: string | null;
  type: PageType;
  title: string;
  icon?: string | null;
  properties?: Record<string, PropertyValue>;
  createdAt?: number;
  doneAt?: number | null;
  favorite?: boolean;
}

// Builds a batch of workspace rows in memory, with order keys continuing after
// `rootAfter` at the root, ready for one `insertRows` call.
export function createWorkspaceBuilder(rootAfter: string | null, now = Date.now()) {
  const rows: WorkspaceRows = {
    pages: [],
    databases: [],
    views: [],
    contents: [],
    dashboards: [],
    scenes: [],
  };
  const lastOrder = new Map<string | null, string | null>([[null, rootAfter]]);

  function nextOrder(parentId: string | null) {
    const order = generateKeyBetween(lastOrder.get(parentId) ?? null, null);
    lastOrder.set(parentId, order);
    return order;
  }

  function page(input: PageInput): Page {
    const created = input.createdAt ?? now;
    const row: Page = {
      id: id(),
      parentId: input.parentId,
      type: input.type,
      title: input.title,
      icon: input.icon ?? null,
      order: nextOrder(input.parentId),
      properties: input.properties ?? {},
      favoritedAt: input.favorite ? now : null,
      lastOpenedAt: null,
      deletedAt: null,
      doneAt: input.doneAt ?? null,
      createdAt: created,
      updatedAt: Math.max(created, input.doneAt ?? created),
    };
    rows.pages.push(row);
    return row;
  }

  function view(databaseId: string, type: ViewType, extra: Partial<View> = {}): void {
    const previous = rows.views.filter((v) => v.databaseId === databaseId).at(-1)?.order ?? null;
    rows.views.push({
      id: id(),
      databaseId,
      name: '',
      type,
      order: generateKeyBetween(previous, null),
      sorts: [],
      filters: [],
      groupBy: null,
      dateProperty: null,
      hiddenProperties: [],
      ...extra,
    });
  }

  function database(
    input: Omit<PageInput, 'type'>,
    properties: PropertyDef[],
  ): { page: Page; database: Database } {
    const row = page({ ...input, type: 'database' });
    const database: Database = { id: row.id, properties };
    rows.databases.push(database);
    const status = properties.find((p) => p.type === 'select');
    const date = properties.find((p) => p.type === 'date');
    view(row.id, 'table');
    view(row.id, 'board', { groupBy: status?.id ?? null });
    view(row.id, 'calendar', { dateProperty: date?.id ?? null });
    return { page: row, database };
  }

  function content(pageId: string, doc: JSONContent): void {
    rows.contents.push({ id: pageId, doc, updatedAt: now });
  }

  function dashboard(pageId: string, sourceId: string): void {
    rows.dashboards.push({ id: pageId, sourceId });
  }

  function scene(pageId: string, elements: BoardElement[]): void {
    rows.scenes.push({ id: pageId, elements, updatedAt: now });
  }

  return { rows, page, database, content, dashboard, scene };
}

export type WorkspaceBuilder = ReturnType<typeof createWorkspaceBuilder>;
