import type { Database, PropertyType } from '@/schemas/database.schema';

import { TITLE_ID } from './apply-view';

export interface ViewField {
  id: string;
  name: string;
  type: PropertyType;
}

export function viewFields(database: Database, titleLabel: string): ViewField[] {
  return [
    { id: TITLE_ID, name: titleLabel, type: 'text' },
    ...database.properties.map(({ id, name, type }) => ({ id, name, type })),
  ];
}

export const SELECT_CLASS =
  'bg-background h-8 min-w-0 rounded-md border px-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';
