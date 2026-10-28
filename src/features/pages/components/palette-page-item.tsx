import { Command } from 'cmdk';

import { usePagesTranslation } from '../i18n';
import { PAGE_TYPE_ICON } from '@/components/page-type-icon';
import type { PaletteEntry } from '../utils/palette';

export const PALETTE_ITEM =
  'relative flex h-10 cursor-pointer items-center gap-3 rounded-md px-3 text-sm data-[selected=true]:bg-hover data-[selected=true]:before:bg-primary data-[selected=true]:before:absolute data-[selected=true]:before:inset-y-2.5 data-[selected=true]:before:left-0 data-[selected=true]:before:w-0.5 data-[selected=true]:before:rounded-full';

export function PalettePageItem({
  entry,
  onOpen,
}: {
  entry: PaletteEntry;
  onOpen: (id: string) => void;
}) {
  const t = usePagesTranslation();
  const { page, path } = entry;
  const Icon = PAGE_TYPE_ICON[page.type];
  const title = page.title || t.untitled;

  return (
    <Command.Item
      value={page.id}
      keywords={[title, path]}
      onSelect={() => onOpen(page.id)}
      className={PALETTE_ITEM}
    >
      {page.icon ? (
        <span className="w-4 shrink-0 text-center">{page.icon}</span>
      ) : (
        <Icon className="text-muted-foreground size-4 shrink-0" />
      )}
      <span className="min-w-0 shrink truncate font-medium">{title}</span>
      {path ? (
        <span className="text-muted-foreground min-w-0 flex-1 truncate text-right text-xs">
          {path}
        </span>
      ) : null}
    </Command.Item>
  );
}
