import { createFileRoute } from '@tanstack/react-router';

import { TrashView } from '@/features/pages';

export const Route = createFileRoute('/_workspace/trash')({
  component: TrashView,
});
