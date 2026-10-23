import type {
  Database,
  Filter,
  FilterOperator,
  PropertyDef,
  PropertyType,
  PropertyValue,
  Sort,
} from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

// Sorts and filters address the record name with this id; anything else is a property.
export const TITLE_ID = 'title';

// Which filter operators make sense per property type ('title' behaves like text).
export const OPERATORS: Record<PropertyType, FilterOperator[]> = {
  text: ['contains', 'is', 'isEmpty', 'isNotEmpty'],
  url: ['contains', 'is', 'isEmpty', 'isNotEmpty'],
  number: ['is', 'isNot', 'isEmpty', 'isNotEmpty'],
  select: ['is', 'isNot', 'isEmpty', 'isNotEmpty'],
  multiSelect: ['contains', 'isEmpty', 'isNotEmpty'],
  date: ['is', 'isEmpty', 'isNotEmpty'],
  checkbox: ['is'],
};

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function valueOf(record: Page, propertyId: string): PropertyValue {
  return propertyId === TITLE_ID ? record.title : (record.properties[propertyId] ?? null);
}

function isEmpty(value: PropertyValue): boolean {
  return (
    value === null || value === '' || value === false || (Array.isArray(value) && !value.length)
  );
}

function matches(record: Page, filter: Filter, type: PropertyType): boolean {
  const value = valueOf(record, filter.propertyId);
  const target = filter.value;
  switch (filter.operator) {
    case 'isEmpty':
      return isEmpty(value);
    case 'isNotEmpty':
      return !isEmpty(value);
    case 'contains':
      if (Array.isArray(value)) {
        return typeof target === 'string' && value.includes(target);
      }
      return (
        typeof value === 'string' &&
        typeof target === 'string' &&
        value.toLowerCase().includes(target.toLowerCase())
      );
    case 'is':
      if (type === 'checkbox') {
        return (value === true) === (target === true);
      }
      if (typeof value === 'string' && typeof target === 'string' && type !== 'select') {
        return value.toLowerCase() === target.toLowerCase();
      }
      return value === target;
    case 'isNot':
      return value !== target;
  }
}

// A filter with nothing to compare against yet (just added, value not picked) is
// ignored rather than hiding every record.
function isIncomplete(filter: Filter, type: PropertyType): boolean {
  const needsValue = filter.operator !== 'isEmpty' && filter.operator !== 'isNotEmpty';
  return needsValue && type !== 'checkbox' && isEmpty(filter.value);
}

function typeOf(database: Database, propertyId: string): PropertyType | null {
  if (propertyId === TITLE_ID) {
    return 'text';
  }
  return database.properties.find((p) => p.id === propertyId)?.type ?? null;
}

// Keeps records matching every filter (AND). Filters on deleted properties are skipped.
export function filterRecords(records: Page[], filters: Filter[], database: Database): Page[] {
  const active = filters.flatMap((filter) => {
    const type = typeOf(database, filter.propertyId);
    return type && !isIncomplete(filter, type) ? [{ filter, type }] : [];
  });
  return records.filter((record) =>
    active.every(({ filter, type }) => matches(record, filter, type)),
  );
}

// Comparable key for sorting: select options sort in their defined order, not by name.
function sortKey(value: PropertyValue, property: PropertyDef | undefined): string | number | null {
  if (isEmpty(value) && property?.type !== 'checkbox') {
    return null;
  }
  if (property?.type === 'select' || property?.type === 'multiSelect') {
    const first = Array.isArray(value) ? value[0] : value;
    const index = property.options.findIndex((o) => o.id === first);
    return index === -1 ? null : index;
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  return typeof value === 'number' || typeof value === 'string' ? value : null;
}

// Applies sorts in priority order (first sort wins, later ones break ties). Empty
// values always go last, whichever the direction — nobody wants blanks on top.
export function sortRecords(records: Page[], sorts: Sort[], database: Database): Page[] {
  const keys = sorts.flatMap((sort): { sort: Sort; property: PropertyDef | undefined }[] => {
    if (sort.propertyId === TITLE_ID) {
      return [{ sort, property: undefined }];
    }
    const property = database.properties.find((p) => p.id === sort.propertyId);
    return property ? [{ sort, property }] : [];
  });
  if (!keys.length) {
    return records;
  }

  return [...records].sort((a, b) => {
    for (const { sort, property } of keys) {
      const ka = sortKey(valueOf(a, sort.propertyId), property);
      const kb = sortKey(valueOf(b, sort.propertyId), property);
      if (ka === kb) continue;
      if (ka === null) return 1;
      if (kb === null) return -1;
      const order =
        typeof ka === 'number' && typeof kb === 'number'
          ? ka - kb
          : collator.compare(String(ka), String(kb));
      if (order !== 0) {
        return sort.direction === 'asc' ? order : -order;
      }
    }
    return 0;
  });
}
