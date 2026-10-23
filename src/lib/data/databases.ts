import { generateKeyBetween } from 'fractional-indexing';

import { db } from '@/lib/db';
import {
  OPTION_COLORS,
  type Database,
  type OptionColor,
  type PropertyDef,
  type PropertyType,
  type PropertyValue,
  type SelectOption,
  type View,
  type ViewType,
} from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { byOrder } from '@/utils/order';

import { createPage } from './pages';

const newId = () => crypto.randomUUID();

function option(name: string, color: OptionColor): SelectOption {
  return { id: newId(), name, color };
}

// Every new database starts useful rather than blank: a Status select (so the board
// view has columns straight away) and a Date (for the calendar later).
function defaultProperties(): PropertyDef[] {
  return [
    {
      id: newId(),
      name: 'Status',
      type: 'select',
      options: [option('To do', 'gray'), option('In progress', 'blue'), option('Done', 'green')],
    },
    { id: newId(), name: 'Date', type: 'date', options: [] },
  ];
}

function makeView(databaseId: string, type: ViewType, name: string, order: string): View {
  return {
    id: newId(),
    databaseId,
    name,
    type,
    order,
    sorts: [],
    filters: [],
    groupBy: null,
    dateProperty: null,
    hiddenProperties: [],
  };
}

// Creates a database page with its column definitions and two starter views: a table
// and a board grouped by Status.
export async function createDatabase(parentId: string | null, title = ''): Promise<Page> {
  return db.transaction('rw', db.pages, db.databases, db.views, async () => {
    const page = await createPage({ parentId, type: 'database', title });
    const properties = defaultProperties();
    const table = makeView(page.id, 'table', 'Table', generateKeyBetween(null, null));
    const board = makeView(page.id, 'board', 'Board', generateKeyBetween(table.order, null));
    board.groupBy = properties[0]?.id ?? null;
    await db.databases.add({ id: page.id, properties });
    await db.views.bulkAdd([table, board]);
    return page;
  });
}

export function getDatabase(id: string): Promise<Database | undefined> {
  return db.databases.get(id);
}

export async function listViews(databaseId: string): Promise<View[]> {
  const views = await db.views.where('databaseId').equals(databaseId).toArray();
  return views.sort(byOrder);
}

// Live records of a database, oldest first (views apply their own sorting on top).
export async function listRecords(databaseId: string): Promise<Page[]> {
  const rows = await db.pages.where('parentId').equals(databaseId).toArray();
  return rows
    .filter((page) => page.type === 'record' && page.deletedAt === null)
    .sort((a, b) => byOrder(a, b));
}

export function addRecord(
  databaseId: string,
  properties: Page['properties'] = {},
  title = '',
): Promise<Page> {
  return createPage({ parentId: databaseId, type: 'record', title, properties });
}

export async function setRecordValue(
  recordId: string,
  propertyId: string,
  value: PropertyValue,
): Promise<void> {
  await db.transaction('rw', db.pages, async () => {
    const record = await db.pages.get(recordId);
    if (record) {
      await db.pages.update(recordId, {
        properties: { ...record.properties, [propertyId]: value },
        updatedAt: Date.now(),
      });
    }
  });
}

// Picks or un-picks a select option on a record. Reads the stored value inside the
// transaction rather than trusting the caller's copy, so quick successive picks (or
// a create-then-pick) build on each other instead of overwriting.
export async function toggleRecordOption(
  recordId: string,
  propertyId: string,
  optionId: string,
  multi: boolean,
): Promise<void> {
  await db.transaction('rw', db.pages, async () => {
    const record = await db.pages.get(recordId);
    if (!record) {
      return;
    }
    const current = record.properties[propertyId];
    const selected = Array.isArray(current)
      ? current
      : typeof current === 'string'
        ? [current]
        : [];
    let next: PropertyValue;
    if (multi) {
      const ids = selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId];
      next = ids.length ? ids : null;
    } else {
      next = selected[0] === optionId ? null : optionId;
    }
    await db.pages.update(recordId, {
      properties: { ...record.properties, [propertyId]: next },
      updatedAt: Date.now(),
    });
  });
}

// Read-modify-write of a database's columns inside one transaction, so two quick
// edits (e.g. creating two options back to back) can't overwrite each other.
async function updateProperties(
  databaseId: string,
  change: (properties: PropertyDef[]) => PropertyDef[],
): Promise<void> {
  await db.transaction('rw', db.databases, async () => {
    const database = await db.databases.get(databaseId);
    if (database) {
      await db.databases.update(databaseId, { properties: change(database.properties) });
    }
  });
}

export async function addProperty(
  databaseId: string,
  type: PropertyType,
  name: string,
): Promise<PropertyDef> {
  const property: PropertyDef = { id: newId(), name, type, options: [] };
  await updateProperties(databaseId, (properties) => [...properties, property]);
  return property;
}

export function renameProperty(databaseId: string, propertyId: string, name: string) {
  return updateProperties(databaseId, (properties) =>
    properties.map((p) => (p.id === propertyId ? { ...p, name } : p)),
  );
}

// Removes a column and everything pointing at it: record values, and any view that
// sorts, filters, groups or hides by it — so no view is left referencing a ghost.
export async function deleteProperty(databaseId: string, propertyId: string): Promise<void> {
  await db.transaction('rw', db.pages, db.databases, db.views, async () => {
    await updateProperties(databaseId, (properties) =>
      properties.filter((p) => p.id !== propertyId),
    );

    const records = await db.pages.where('parentId').equals(databaseId).toArray();
    await db.pages.bulkUpdate(
      records
        .filter((record) => propertyId in record.properties)
        .map((record) => {
          const { [propertyId]: _removed, ...properties } = record.properties;
          return { key: record.id, changes: { properties } };
        }),
    );

    const views = await db.views.where('databaseId').equals(databaseId).toArray();
    await db.views.bulkUpdate(
      views.map((view) => ({
        key: view.id,
        changes: {
          sorts: view.sorts.filter((sort) => sort.propertyId !== propertyId),
          filters: view.filters.filter((filter) => filter.propertyId !== propertyId),
          groupBy: view.groupBy === propertyId ? null : view.groupBy,
          dateProperty: view.dateProperty === propertyId ? null : view.dateProperty,
          hiddenProperties: view.hiddenProperties.filter((id) => id !== propertyId),
        },
      })),
    );
  });
}

// Adds a select option, cycling through the colors so neighbours differ.
export async function addOption(
  databaseId: string,
  propertyId: string,
  name: string,
): Promise<SelectOption> {
  let created = option(name, 'gray');
  await updateProperties(databaseId, (properties) =>
    properties.map((p) => {
      if (p.id !== propertyId) {
        return p;
      }
      const color = OPTION_COLORS[p.options.length % OPTION_COLORS.length] ?? 'gray';
      created = { ...created, color };
      return { ...p, options: [...p.options, created] };
    }),
  );
  return created;
}

export async function updateView(id: string, changes: Partial<Omit<View, 'id'>>): Promise<void> {
  await db.views.update(id, changes);
}

export async function addView(databaseId: string, type: ViewType, name: string): Promise<View> {
  const views = await listViews(databaseId);
  const view = makeView(
    databaseId,
    type,
    name,
    generateKeyBetween(views.at(-1)?.order ?? null, null),
  );
  await db.views.add(view);
  return view;
}
