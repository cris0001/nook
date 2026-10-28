import { useNavigate } from '@tanstack/react-router';
import { Copy, Maximize2, MoreHorizontal, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/use-can';
import { useTrashWithUndo } from '@/hooks/use-trash-with-undo';
import { duplicatePage } from '@/lib/data/pages';
import { cn } from '@/lib/utils';

import { useDatabasesTranslation } from '../i18n';

export function RecordActionsMenu({
  recordId,
  title,
  className,
}: {
  recordId: string;
  title: string;
  className?: string;
}) {
  const t = useDatabasesTranslation();
  const navigate = useNavigate();
  const trashWithUndo = useTrashWithUndo();
  const allowed = usePermissions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.recordActions}
        title={t.recordActions}
        className={cn(
          'text-muted-foreground hover:bg-hover hover:text-foreground data-[state=open]:bg-hover flex size-7 shrink-0 items-center justify-center rounded-md',
          className,
        )}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onCloseAutoFocus={(event) => event.preventDefault()}>
        <DropdownMenuItem
          onSelect={() => void navigate({ to: '/p/$pageId', params: { pageId: recordId } })}
        >
          <Maximize2 />
          {t.open}
        </DropdownMenuItem>
        {allowed('record.edit') ? (
          <DropdownMenuItem onSelect={() => void duplicatePage(recordId)}>
            <Copy />
            {t.duplicate}
          </DropdownMenuItem>
        ) : null}
        {allowed('page.trash') ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => void trashWithUndo(recordId, title)}
            >
              <Trash2 />
              {t.moveToTrash}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
