import { DndContext, DragOverlay } from '@dnd-kit/core';
import { createPortal } from 'react-dom';

import type { Page } from '@/schemas/page.schema';

import { usePageDnd } from '../hooks/use-page-dnd';
import { usePageTree } from '../hooks/use-page-tree';
import { useSidebarUiStore } from '../stores/sidebar-ui.store';
import type { PageNode } from '../utils/page-tree';
import { PageDragPreview } from './page-drag-preview';
import { PageTreeItem } from './page-tree-item';

export function PageTree() {
  const state = usePageTree();
  if (state.status === 'loading') {
    return null;
  }
  return <DraggableTree tree={state.tree} pages={state.pages} />;
}

function DraggableTree({ tree, pages }: { tree: PageNode[]; pages: Page[] }) {
  const dnd = usePageDnd(pages);
  const draggingId = useSidebarUiStore((s) => s.draggingId);
  const dragging = draggingId ? pages.find((page) => page.id === draggingId) : undefined;

  return (
    <DndContext {...dnd}>
      <ul className="flex flex-col">
        {tree.map((node) => (
          <PageTreeItem key={node.page.id} node={node} depth={0} />
        ))}
      </ul>
      {/* Portaled: the mobile drawer is transformed, which would offset a fixed overlay. */}
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {dragging ? <PageDragPreview page={dragging} /> : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
