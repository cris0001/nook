import { useRouterState } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';

import { BrandMark } from '@/components/brand';
import { useCommonTranslation } from '@/lib/i18n/common';
import { cn } from '@/lib/utils';

// Two-pane workspace frame. On lg+ the sidebar is a fixed column; below that it
// becomes an off-canvas drawer opened from a slim top bar, so phones get the full
// width for content. The drawer remembers the path it was opened on and counts as open
// only while that path is current, so any navigation (a link, or "New page" opening
// the page it just created) closes it without an effect. Backdrop tap, Escape and
// tapping a link to the current page close it too.
export function AppShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const t = useCommonTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const close = () => setOpenedOn(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenedOn(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest('a')) {
      close();
    }
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="bg-sidebar sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r lg:flex">
        {sidebar}
      </aside>

      <div className={cn('fixed inset-0 z-40 lg:hidden', !open && 'pointer-events-none')}>
        <div
          aria-hidden
          onClick={close}
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity duration-200',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <aside
          inert={!open}
          onClickCapture={closeOnLink}
          className={cn(
            'bg-sidebar absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r transition-[translate,box-shadow] duration-200 ease-out',
            open ? 'translate-x-0 shadow-xl' : '-translate-x-full',
          )}
        >
          {sidebar}
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/85 sticky top-0 z-30 flex h-12 items-center gap-2 border-b px-2 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-label={t.openMenu}
            aria-expanded={open}
            onClick={() => setOpenedOn(pathname)}
            className="hover:bg-hover flex size-10 items-center justify-center rounded-lg"
          >
            <Menu className="size-5" />
          </button>
          <BrandMark className="text-xl" />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
