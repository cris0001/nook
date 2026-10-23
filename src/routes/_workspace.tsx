import { createFileRoute, Outlet } from '@tanstack/react-router';

import { AppShell } from '@/components/app-shell';
import { PageSidebar } from '@/features/pages';

// Workspace layout: sidebar + content for every in-app route.
export const Route = createFileRoute('/_workspace')({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  return (
    <AppShell sidebar={<PageSidebar />}>
      <Outlet />
    </AppShell>
  );
}
