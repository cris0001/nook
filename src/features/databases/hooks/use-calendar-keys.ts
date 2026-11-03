import { addMonths, addWeeks } from 'date-fns';
import { useEffect, type Dispatch, type SetStateAction } from 'react';

import { isTypingTarget } from '@/utils/typing-target';

import { useCalendarUiStore } from '../stores/calendar-ui.store';
import type { CalendarMode } from '../utils/calendar';

export function useCalendarKeys(mode: CalendarMode, setAnchor: Dispatch<SetStateAction<Date>>) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || useCalendarUiStore.getState().draggingId) return;
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (document.querySelector('[role="dialog"], [data-radix-popper-content-wrapper]')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const step = event.key === 'ArrowLeft' ? -1 : 1;
        setAnchor((a) => (mode === 'month' ? addMonths(a, step) : addWeeks(a, step)));
      } else if (event.key.toLowerCase() === 't') {
        setAnchor(new Date());
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, setAnchor]);
}
