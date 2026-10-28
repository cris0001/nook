import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { addMonths, addWeeks, format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { useCan } from '@/hooks/use-can';
import { useDateLocale } from '@/hooks/use-date-locale';
import { cn } from '@/lib/utils';
import { addRecord, setRecordValue } from '@/lib/data/databases';
import type { Database, View } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';
import { todayKey } from '@/utils/dates';
import { statusPropertyOf } from '@/utils/progress';

import { useCalendarKeys } from '../hooks/use-calendar-keys';
import { useDatabasesTranslation } from '../i18n';
import { useCalendarUiStore } from '../stores/calendar-ui.store';
import { calendarDateProperty, recordsByDay, weekDays, type CalendarMode } from '../utils/calendar';
import { monthGrid } from '../utils/month-grid';
import { CHIP } from './calendar-chip';
import { CalendarDay } from './calendar-day';
import { CalendarHeader } from './calendar-header';
import { UNDATED, UndatedTray } from './undated-tray';

export function CalendarView({
  database,
  view,
  records,
}: {
  database: Database;
  view: View;
  records: Page[];
}) {
  const t = useDatabasesTranslation();
  const { locale, weekStartsOn } = useDateLocale();
  const canEdit = useCan('record.edit');
  const [mode, setMode] = useState<CalendarMode>('month');
  const [anchor, setAnchor] = useState(() => new Date());
  const [trayOpen, setTrayOpen] = useState(false);
  const { draggingId, setDragging, setOverDay, setEditing } = useCalendarUiStore();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
  );
  const dateProperty = calendarDateProperty(database, view);
  const status = statusPropertyOf(database);
  useCalendarKeys(mode, setAnchor);

  const byDay = useMemo(
    () => (dateProperty ? recordsByDay(records, dateProperty.id) : new Map<string, Page[]>()),
    [records, dateProperty],
  );

  if (!dateProperty) {
    return <p className="text-muted-foreground py-10 text-sm">{t.noDateProperty}</p>;
  }

  const week = weekDays(anchor, weekStartsOn);
  const days = mode === 'month' ? monthGrid(anchor, weekStartsOn) : week;
  const month = format(anchor, 'yyyy-MM');
  const today = todayKey();
  const dragging = draggingId ? records.find((r) => r.id === draggingId) : undefined;
  const undated = records.filter((r) => typeof r.properties[dateProperty.id] !== 'string');

  async function add(day: string) {
    if (!dateProperty) return;
    const record = await addRecord(database.id, { [dateProperty.id]: day });
    setEditing(record.id);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setDragging(null);
    const target = typeof over?.id === 'string' ? over.id : null;
    const record = records.find((r) => r.id === active.id);
    if (!dateProperty || !record || !target) return;
    const day = target === UNDATED ? null : target.replace(/^day:/, '');
    if ((record.properties[dateProperty.id] ?? null) !== day) {
      void setRecordValue(record.id, dateProperty.id, day);
    }
  }

  return (
    <div className="pt-3 pb-6">
      <CalendarHeader
        anchor={anchor}
        week={week}
        mode={mode}
        undated={undated.length}
        trayOpen={trayOpen}
        onToggleTray={() => setTrayOpen((open) => !open)}
        onMode={setMode}
        onStep={(step) =>
          setAnchor((a) => (mode === 'month' ? addMonths(a, step) : addWeeks(a, step)))
        }
        onToday={() => setAnchor(new Date())}
      />
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => setDragging(String(active.id))}
        onDragOver={({ over }) => setOverDay(over ? String(over.id).replace(/^day:/, '') : null)}
        onDragCancel={() => setDragging(null)}
        onDragEnd={onDragEnd}
      >
        {trayOpen && undated.length ? <UndatedTray records={undated} status={status} /> : null}
        <div className="border-divider overflow-hidden rounded-lg border-r border-b">
          <div className="grid grid-cols-7">
            {week.map((day) => (
              <p
                key={day}
                className="eyebrow border-divider truncate border-t border-l px-1.5 py-2 sm:px-2"
              >
                {format(parseISO(day), 'EEE', { locale })}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => (
              <CalendarDay
                key={day}
                day={day}
                records={byDay.get(day) ?? []}
                status={status}
                mode={mode}
                today={today}
                inMonth={mode === 'week' || day.startsWith(month)}
                onAdd={canEdit ? (d) => void add(d) : null}
              />
            ))}
          </div>
        </div>
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {dragging ? (
              <div className={cn(CHIP, 'w-44 rotate-1 cursor-grabbing font-medium')}>
                <span className="truncate">{dragging.title || t.untitled}</span>
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
}
