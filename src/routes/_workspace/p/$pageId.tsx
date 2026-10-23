import { createFileRoute } from '@tanstack/react-router';

import { DatabaseView, RecordProperties } from '@/features/databases';
import { PageView } from '@/features/pages';
import type { Page } from '@/schemas/page.schema';

export const Route = createFileRoute('/_workspace/p/$pageId')({
  component: PageRoute,
});

// Picks what goes under the title for each page type. Composing here keeps the pages
// and databases features independent of each other.
function pageBody(page: Page) {
  switch (page.type) {
    case 'database':
      return <DatabaseView databaseId={page.id} />;
    case 'record':
      return <RecordProperties record={page} />;
    default:
      return null;
  }
}

function PageRoute() {
  const { pageId } = Route.useParams();
  return <PageView pageId={pageId} body={pageBody} />;
}
