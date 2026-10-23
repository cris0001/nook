import { createFileRoute } from '@tanstack/react-router';

import { PageView } from '@/features/pages';

export const Route = createFileRoute('/_workspace/p/$pageId')({
  component: PageRoute,
});

function PageRoute() {
  const { pageId } = Route.useParams();
  return <PageView pageId={pageId} />;
}
