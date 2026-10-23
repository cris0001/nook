import { Copy, MoreHorizontal, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { useDuplicatePage } from '../hooks/use-duplicate-page';
import { useTrashPage } from '../hooks/use-trash-page';
import { usePagesTranslation } from '../i18n';

// The "⋯" menu on a page row. The trigger is styled by the caller (it hides until
// hover on desktop rows but stays visible on touch).
export function PageActionsMenu({ pageId, className }: { pageId: string; className?: string }) {
  const t = usePagesTranslation();
  const duplicate = useDuplicatePage();
  const trash = useTrashPage();

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
        <DropdownMenuItem onSelect={() => void duplicate(pageId)}>
          <Copy />
          {t.actions.duplicate}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => void trash(pageId)}>
          <Trash2 />
          {t.actions.moveToTrash}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
