import { createFileRoute } from '@tanstack/react-router';

import { WorkspaceHome } from '@/features/pages';

export const Route = createFileRoute('/_workspace/')({
  component: WorkspaceHome,
});
