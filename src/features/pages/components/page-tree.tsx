import { usePageTree } from '../hooks/use-page-tree';
import { PageTreeItem } from './page-tree-item';

// The nested page list in the sidebar. Renders nothing while IndexedDB loads — it's a
// few milliseconds, not worth a skeleton flash.
export function PageTree() {
  const state = usePageTree();

  if (state.status === 'loading') {
    return null;
  }

  return (
    <ul className="flex flex-col">
      {state.tree.map((node) => (
        <PageTreeItem key={node.page.id} node={node} depth={0} />
      ))}
    </ul>
  );
}
