import { Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/use-can';
import { cn } from '@/lib/utils';

import { useDuplicatePage } from '../hooks/use-duplicate-page';
import { useTrashPage } from '../hooks/use-trash-page';
import { usePagesTranslation } from '../i18n';
import { useSidebarUiStore } from '../stores/sidebar-ui.store';

// The "⋯" menu on a page row (with Rename, which edits the title in place in the tree)
// and in the page header. The trigger is styled by the caller (it hides until
// hover on desktop rows but stays visible on touch).
export function PageActionsMenu({
  pageId,
  className,
  renamable = false,
}: {
  pageId: string;
  className?: string;
  renamable?: boolean;
}) {
  const t = usePagesTranslation();
  const duplicate = useDuplicatePage();
  const trash = useTrashPage();
  const setRenaming = useSidebarUiStore((s) => s.setRenaming);
  const allowed = usePermissions();

  if (!allowed('page.edit')) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.actions.label}
        title={t.actions.label}
        className={cn(
          'text-muted-foreground hover:bg-hover data-[state=open]:bg-hover flex size-6 shrink-0 items-center justify-center rounded',
          className,
        )}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onCloseAutoFocus={(event) => event.preventDefault()}>
        {renamable ? (
          <DropdownMenuItem onSelect={() => setRenaming(pageId)}>
            <Pencil />
            {t.actions.rename}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onSelect={() => void duplicate(pageId)}>
          <Copy />
          {t.actions.duplicate}
        </DropdownMenuItem>
        {allowed('page.trash') ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => void trash(pageId)}>
              <Trash2 />
              {t.actions.moveToTrash}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
