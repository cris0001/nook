import { Link } from '@tanstack/react-router';
import { House, Search, Trash2 } from 'lucide-react';

import { BrandMark } from '@/components/brand';
import { ProfileMenu } from '@/components/profile-menu';
import { cn } from '@/lib/utils';

import { usePagesTranslation } from '../i18n';
import { useCommandPaletteStore } from '../stores/command-palette.store';
import { ACTIVE_SELF, SECTION_LABEL, SIDEBAR_ROW } from '../utils/row-styles';
import { FavoritesList } from './favorites-list';
import { NewPageMenu } from './new-page-menu';
import { PageTree } from './page-tree';

const SHORTCUT = /mac|iphone|ipad/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl K';

export function PageSidebar({ todayCount = 0 }: { todayCount?: number }) {
  const t = usePagesTranslation();
  const openPalette = useCommandPaletteStore((s) => s.setOpen);

  return (
    <div className="flex h-full min-h-0 flex-col px-2.5 pt-2.5 pb-2">
      <div className="flex h-12 items-center justify-between pr-1 pl-2">
        <Link to="/" aria-label="nOOk">
          <BrandMark animated className="text-[36px]" />
        </Link>
        <NewPageMenu />
      </div>

      <button
        type="button"
        onClick={() => openPalette(true)}
        className={cn(SIDEBAR_ROW, 'mt-3 gap-2 pr-2 pl-2 text-left')}
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1">{t.search}</span>
        <kbd className="text-muted-foreground bg-background/60 rounded border px-1.5 font-mono text-[10.5px]">
          {SHORTCUT}
        </kbd>
      </button>
      <Link
        to="/"
        activeOptions={{ exact: true }}
        className={cn(SIDEBAR_ROW, ACTIVE_SELF, 'gap-2 pr-2.5 pl-2')}
      >
        <House className="size-4 shrink-0" />
        <span className="flex-1">{t.today}</span>
        {todayCount ? (
          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            {todayCount}
          </span>
        ) : null}
      </Link>

      <nav aria-label={t.pages} className="-mx-1.5 min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
        <FavoritesList />
        <p className={SECTION_LABEL}>{t.pages}</p>
        <PageTree />
      </nav>

      <Link to="/trash" className={cn(SIDEBAR_ROW, ACTIVE_SELF, 'gap-2 px-2')}>
        <Trash2 className="size-4 shrink-0" />
        {t.trash.title}
      </Link>
      <div className="border-divider mt-1.5 border-t pt-1.5">
        <ProfileMenu />
      </div>
    </div>
  );
}
