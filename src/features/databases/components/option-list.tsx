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
import { GripVertical } from 'lucide-react';

import { reorderOptions } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import type { PropertyDef, SelectOption } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { OptionEditButton } from './option-edit-button';
import { OptionTag } from './option-tag';

// A select property's options, reorderable by their grip and editable via "⋯". The
// order set here is the board's column order.
export function OptionList({
  databaseId,
  property,
}: {
  databaseId: string;
  property: PropertyDef;
}) {
  const t = useDatabasesTranslation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const ids = property.options.map((o) => o.id);

  function onDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
      void reorderOptions(databaseId, property.id, next);
    }
  }

  if (!property.options.length) {
    return null;
  }

  return (
    <div className="mt-1 border-t pt-1">
      <p className="text-muted-foreground px-2 py-1 text-xs">{t.options}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul>
            {property.options.map((option) => (
              <OptionRow
                key={option.id}
                databaseId={databaseId}
                propertyId={property.id}
                option={option}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function OptionRow({
  databaseId,
  propertyId,
  option,
}: {
  databaseId: string;
  propertyId: string;
  option: SelectOption;
}) {
  const t = useDatabasesTranslation();
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: option.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'bg-background flex h-9 items-center gap-1 rounded-md lg:h-8',
        isDragging && 'relative z-10 shadow-md',
      )}
    >
      <button
        type="button"
        aria-label={t.dragToReorder}
        {...attributes}
        {...listeners}
        className="text-muted-foreground flex h-full w-6 shrink-0 cursor-grab touch-none items-center justify-center"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="min-w-0 flex-1">
        <OptionTag option={option} />
      </span>
      <OptionEditButton databaseId={databaseId} propertyId={propertyId} option={option} />
    </li>
  );
}
