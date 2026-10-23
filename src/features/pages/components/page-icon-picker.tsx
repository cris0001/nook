import { Shuffle } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { setPageIcon } from '@/lib/data/pages';
import { usePagesTranslation } from '../i18n';
import { PAGE_EMOJIS } from '../utils/page-emojis';

// Emoji picker for a page icon, opened from whatever trigger the caller passes (the
// big icon itself, or an "Add icon" button). Picking closes it straight away.
export function PageIconPicker({
  pageId,
  hasIcon,
  children,
}: {
  pageId: string;
  hasIcon: boolean;
  children: ReactNode;
}) {
  const t = usePagesTranslation();
  const [open, setOpen] = useState(false);

  function pick(icon: string | null) {
    void setPageIcon(pageId, icon);
    setOpen(false);
  }

  function random() {
    pick(PAGE_EMOJIS[Math.floor(Math.random() * PAGE_EMOJIS.length)] ?? null);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[19rem] p-2">
        <div className="flex items-center justify-between gap-2 px-1 pb-2">
          <button
            type="button"
            onClick={random}
            className="text-muted-foreground hover:bg-hover hover:text-foreground flex h-8 items-center gap-1.5 rounded-md px-2 text-sm"
          >
            <Shuffle className="size-3.5" />
            {t.icon.random}
          </button>
          {hasIcon ? (
            <button
              type="button"
              onClick={() => pick(null)}
              className="text-muted-foreground hover:bg-hover hover:text-foreground h-8 rounded-md px-2 text-sm"
            >
              {t.icon.remove}
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-8 gap-0.5">
          {PAGE_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => pick(emoji)}
              className="hover:bg-hover flex aspect-square items-center justify-center rounded-md text-xl"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
