import { createFileRoute } from '@tanstack/react-router';

import { lazy, Suspense, type ReactNode } from 'react';

import { PageView } from '@/features/pages';
import type { Page } from '@/schemas/page.schema';

// Each page type's body is its own chunk: opening a document doesn't download the
// whiteboard, the charts or the database views.
const DocumentEditor = lazy(() =>
  import('@/features/documents').then((m) => ({ default: m.DocumentEditor })),
);
const DatabaseView = lazy(() =>
  import('@/features/databases').then((m) => ({ default: m.DatabaseView })),
);
const RecordProperties = lazy(() =>
  import('@/features/databases').then((m) => ({ default: m.RecordProperties })),
);
const DashboardView = lazy(() =>
  import('@/features/dashboards').then((m) => ({ default: m.DashboardView })),
);
const WhiteboardView = lazy(() =>
  import('@/features/whiteboard').then((m) => ({ default: m.WhiteboardView })),
);

export const Route = createFileRoute('/_workspace/p/$pageId')({
  component: PageRoute,
});

function pageBody(page: Page, editable: boolean): ReactNode {
  return <Suspense fallback={null}>{body(page, editable)}</Suspense>;
}

function body(page: Page, editable: boolean) {
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
