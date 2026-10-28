import { createFileRoute, Outlet } from '@tanstack/react-router';

import { AppShell } from '@/components/app-shell';
import { CommandPalette, PageSidebar } from '@/features/pages';
import { useAgendaCount } from '@/features/today';

export const Route = createFileRoute('/_workspace')({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const todayCount = useAgendaCount();
  return (
    <AppShell sidebar={<PageSidebar todayCount={todayCount} />}>
      <Outlet />
      <CommandPalette />
    </AppShell>
  );
}
