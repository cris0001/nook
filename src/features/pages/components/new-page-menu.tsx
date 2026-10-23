import { Database, FileText, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useCreatePage } from '../hooks/use-create-page';
import { usePagesTranslation } from '../i18n';

const KINDS = [
  { type: 'document', Icon: FileText },
  { type: 'database', Icon: Database },
] as const;

// The lime "+" pill in the sidebar header: pick what to create at the root.
// Whiteboards and dashboards join this list in their own stages.
export function NewPageMenu() {
  const t = usePagesTranslation();
  const createPage = useCreatePage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.newPage}
        title={t.newPage}
        className="bg-primary text-primary-foreground flex h-8 w-11 shrink-0 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12),0_1px_2px_rgb(0_0_0/0.08)] transition-[filter] hover:brightness-95 lg:h-6 lg:w-8"
      >
        <Plus className="size-4" strokeWidth={2.5} />
      </DropdownMenuTrigger>
      {/* Don't hand focus back to the trigger on close — the new page's title input
          has just taken it, ready for typing. */}
      <DropdownMenuContent align="end" onCloseAutoFocus={(event) => event.preventDefault()}>
        {KINDS.map(({ type, Icon }) => (
          <DropdownMenuItem key={type} onSelect={() => void createPage({ parentId: null, type })}>
            <Icon />
            {t.newKind[type]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
