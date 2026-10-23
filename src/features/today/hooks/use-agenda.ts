import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';

import { todayKey } from '@/utils/dates';

import { loadAgendaSources } from '../api/agenda';
import { buildAgenda, type Agenda } from '../utils/agenda';

export type AgendaState =
  { status: 'loading' } | { status: 'ready'; agenda: Agenda; databases: number };

// Today's agenda across all databases, live: checking a task off anywhere (here, on a
// board, in a table) moves it out of the list immediately.
export function useAgenda(): AgendaState {
  const sources = useLiveQuery(loadAgendaSources, []);
  const today = todayKey();
  const agenda = useMemo(() => (sources ? buildAgenda(sources, today) : null), [sources, today]);
  return sources && agenda
    ? { status: 'ready', agenda, databases: sources.length }
    : { status: 'loading' };
}

// Number of open dated tasks up to the end of the week — the badge next to "Today".
export function useAgendaCount(): number {
  const state = useAgenda();
  if (state.status !== 'ready') {
    return 0;
  }
  const { overdue, today, week } = state.agenda;
  return overdue.length + today.length + week.length;
}
