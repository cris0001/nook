import { createFileRoute, Outlet } from '@tanstack/react-router';

import { AppShell } from '@/components/app-shell';
import { PageSidebar } from '@/features/pages';
import { useAgendaCount } from '@/features/today';

// Workspace layout: sidebar + content for every in-app route. The Today badge count
// comes from the today feature and is handed to the sidebar here.
export const Route = createFileRoute('/_workspace')({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const todayCount = useAgendaCount();
  return (
    <AppShell sidebar={<PageSidebar todayCount={todayCount} />}>
      <Outlet />
    </AppShell>
  );
}
