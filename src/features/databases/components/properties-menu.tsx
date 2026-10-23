import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, EyeOff, GripVertical, SlidersHorizontal } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { reorderProperties, updateView } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import type { Database, PropertyDef, View } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { PROPERTY_ICON } from '../utils/property-icon';
import { ToolbarButton } from './toolbar-button';

// Column visibility (per view) and column order (shared by all views of the database).
// Rows reorder by dragging their grip; the eye toggles visibility in this view only.
export function PropertiesMenu({ database, view }: { database: Database; view: View }) {
  const t = useDatabasesTranslation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const ids = database.properties.map((p) => p.id);

  function onDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
      void reorderProperties(database.id, next);
    }
  }

  function toggle(id: string) {
    const hidden = view.hiddenProperties.includes(id)
      ? view.hiddenProperties.filter((h) => h !== id)
      : [...view.hiddenProperties, id];
    void updateView(view.id, { hiddenProperties: hidden });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton active={view.hiddenProperties.length > 0}>
          <SlidersHorizontal className="size-4" />
          <span className="max-sm:sr-only">{t.properties}</span>
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <ul>
              {database.properties.map((property) => (
                <PropertyRow
                  key={property.id}
                  property={property}
                  hidden={view.hiddenProperties.includes(property.id)}
                  onToggle={() => toggle(property.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </PopoverContent>
    </Popover>
  );
}

function PropertyRow({
  property,
  hidden,
  onToggle,
}: {
  property: PropertyDef;
  hidden: boolean;
  onToggle: () => void;
}) {
  const t = useDatabasesTranslation();
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: property.id,
  });
  const Icon = PROPERTY_ICON[property.type];

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn(
        'bg-background flex h-9 items-center gap-1.5 rounded-md pr-1 lg:h-8',
        isDragging && 'relative z-10 shadow-md',
      )}
    >
      <button
        type="button"
        aria-label={t.dragToReorder}
        {...attributes}
        {...listeners}
        className="text-muted-foreground flex h-full w-6 cursor-grab touch-none items-center justify-center"
      >
        <GripVertical className="size-4" />
      </button>
      <Icon className="text-muted-foreground size-4 shrink-0" />
      <span className={cn('min-w-0 flex-1 truncate text-sm', hidden && 'text-muted-foreground')}>
        {property.name}
      </span>
      <button
        type="button"
        aria-label={hidden ? t.show : t.hide}
        aria-pressed={!hidden}
        onClick={onToggle}
        className="text-muted-foreground hover:bg-hover hover:text-foreground flex size-7 items-center justify-center rounded-md"
      >
        {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </li>
  );
}
