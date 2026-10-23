import { z } from 'zod';

export const PROPERTY_TYPES = [
  'text',
  'number',
  'select',
  'multiSelect',
  'date',
  'checkbox',
  'url',
] as const;

export const OPTION_COLORS = [
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
] as const;

export const PropertyTypeSchema = z.enum(PROPERTY_TYPES);
export const OptionColorSchema = z.enum(OPTION_COLORS);

export const SelectOptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  color: OptionColorSchema,
});

export const PropertyDefSchema = z.object({
  id: z.string().min(1),
  name: z.string().max(100),
  type: PropertyTypeSchema,
  options: z.array(SelectOptionSchema),
});

export const DatabaseSchema = z.object({
  id: z.uuid(),
  properties: z.array(PropertyDefSchema),
});

// A cell value. Dates are 'YYYY-MM-DD' strings (calendar days, no time zone drift);
// selects store option ids; null means empty.
export const PropertyValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null(),
]);

export const VIEW_TYPES = ['table', 'board', 'calendar'] as const;
export const ViewTypeSchema = z.enum(VIEW_TYPES);

export const SortSchema = z.object({
  propertyId: z.string().min(1),
  direction: z.enum(['asc', 'desc']),
});

export const FILTER_OPERATORS = ['contains', 'is', 'isNot', 'isEmpty', 'isNotEmpty'] as const;

export const FilterSchema = z.object({
  id: z.string().min(1),
  propertyId: z.string().min(1),
  operator: z.enum(FILTER_OPERATORS),
  value: PropertyValueSchema,
});

export const ViewSchema = z.object({
  id: z.uuid(),
  databaseId: z.uuid(),
  name: z.string().max(100),
  type: ViewTypeSchema,
  order: z.string().min(1),
  sorts: z.array(SortSchema),
  filters: z.array(FilterSchema),
  groupBy: z.string().nullable(),
  dateProperty: z.string().nullable(),
  hiddenProperties: z.array(z.string()),
});

export type PropertyType = z.infer<typeof PropertyTypeSchema>;
export type OptionColor = z.infer<typeof OptionColorSchema>;
export type SelectOption = z.infer<typeof SelectOptionSchema>;
export type PropertyDef = z.infer<typeof PropertyDefSchema>;
export type Database = z.infer<typeof DatabaseSchema>;
export type PropertyValue = z.infer<typeof PropertyValueSchema>;
export type ViewType = z.infer<typeof ViewTypeSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type FilterOperator = (typeof FILTER_OPERATORS)[number];
export type Filter = z.infer<typeof FilterSchema>;
export type View = z.infer<typeof ViewSchema>;
