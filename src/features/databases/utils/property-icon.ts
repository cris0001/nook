import {
  Calendar,
  CircleChevronDown,
  Hash,
  Link,
  List,
  SquareCheck,
  Text,
  type LucideIcon,
} from 'lucide-react';

import type { PropertyType } from '@/schemas/database.schema';

export const PROPERTY_ICON: Record<PropertyType, LucideIcon> = {
  text: Text,
  number: Hash,
  select: CircleChevronDown,
  multiSelect: List,
  date: Calendar,
  checkbox: SquareCheck,
  url: Link,
};
