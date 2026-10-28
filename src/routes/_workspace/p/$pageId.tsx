import { createFileRoute } from '@tanstack/react-router';

import { DashboardView } from '@/features/dashboards';
import { DatabaseView, RecordProperties } from '@/features/databases';
import { DocumentEditor } from '@/features/documents';
import { PageView } from '@/features/pages';
import { WhiteboardView } from '@/features/whiteboard';
import type { Page } from '@/schemas/page.schema';

export const Route = createFileRoute('/_workspace/p/$pageId')({
  component: PageRoute,
});

function pageBody(page: Page, editable: boolean) {
  switch (page.type) {
    case 'database':
      return <DatabaseView databaseId={page.id} />;
    case 'record':
      return (
        <>
          <RecordProperties record={page} />
          <hr className="my-6" />
          <DocumentEditor pageId={page.id} editable={editable} />
        </>
      );
    case 'whiteboard':
      return <WhiteboardView pageId={page.id} title={page.title} editable={editable} />;
    case 'dashboard':
      return <DashboardView pageId={page.id} editable={editable} />;
    case 'document':
      return <DocumentEditor pageId={page.id} editable={editable} />;
    default:
      return null;
  }
}

function PageRoute() {
  const { pageId } = Route.useParams();
  return <PageView pageId={pageId} body={pageBody} />;
}
