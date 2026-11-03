import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

import { AppShell } from '@/components/app-shell';
import { CommandPalette, PageSidebar } from '@/features/pages';
import { DemoDataActions, useSampleWorkspace } from '@/features/onboarding';
import { useAgendaCount } from '@/features/today';

export const Route = createFileRoute('/_workspace')({
  component: WorkspaceLayout,
});

// Page bodies are lazy chunks; warm the common ones once the app is idle so the first
// document or database opens without a wait (and Enter in a new title reaches the body).
function usePrefetchViews() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void import('@/features/documents');
      void import('@/features/databases');
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);
}

function WorkspaceLayout() {
  useSampleWorkspace();
  usePrefetchViews();
  const todayCount = useAgendaCount();
  return (
    <AppShell sidebar={<PageSidebar todayCount={todayCount} profileExtra={<DemoDataActions />} />}>
      <Outlet />
      <CommandPalette />
    </AppShell>
  );
}
