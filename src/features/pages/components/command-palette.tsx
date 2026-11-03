import { useNavigate } from '@tanstack/react-router';
import { Command } from 'cmdk';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';

import { BrandMark } from '@/components/brand';
import { listPages } from '@/lib/data/pages';

import { usePagesTranslation } from '../i18n';
import { useCommandPaletteStore } from '../stores/command-palette.store';
import { recentOf } from '../utils/page-lists';
import { paletteEntries, searchPalette } from '../utils/palette';
import { PaletteActions } from './palette-actions';
import { PalettePageItem } from './palette-page-item';

const GROUP =
  '[&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5';

export function CommandPalette() {
  const t = usePagesTranslation();
  const navigate = useNavigate();
  const open = useCommandPaletteStore((s) => s.open);
  const setOpen = useCommandPaletteStore((s) => s.setOpen);
  const [search, setSearch] = useState('');
  const pages = useLiveQuery(listPages, []);
  const searching = search.trim() !== '';
  const results = useMemo(
    () => (pages && searching ? searchPalette(pages, search, t.untitled) : null),
    [pages, search, searching, t.untitled],
  );
  const recent = useMemo(
    () => (pages ? paletteEntries(recentOf(pages, 5), t.untitled) : []),
    [pages, t.untitled],
  );

  function close() {
    setOpen(false);
    setSearch('');
  }

  function openPage(id: string) {
    close();
    void navigate({ to: '/p/$pageId', params: { pageId: id } });
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => (next ? setOpen(true) : close())}
      label={t.palette.label}
      shouldFilter={false}
      overlayClassName="fixed inset-0 z-50 bg-black/25 animate-[fade-in_120ms_ease-out]"
      contentClassName="bg-background shadow-raised fixed top-[12vh] left-1/2 z-50 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl"
    >
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder={t.palette.placeholder}
        className="border-divider placeholder:text-muted-foreground/70 h-13 w-full border-b bg-transparent px-4 text-[15px] outline-none"
      />
      <Command.List className="max-h-[min(26rem,60vh)] overflow-y-auto p-1.5">
        <Command.Empty className="text-muted-foreground flex flex-col items-center gap-3 py-10 text-sm">
          <BrandMark eyesOnly mood="asleep" className="text-3xl" />
          {t.palette.empty}
        </Command.Empty>

        {results ? (
          <>
            {results.navigation.length ? (
              <Command.Group heading={t.palette.pages} className={GROUP}>
                {results.navigation.map((entry) => (
                  <PalettePageItem key={entry.page.id} entry={entry} onOpen={openPage} />
                ))}
              </Command.Group>
            ) : null}
            {results.records.length ? (
              <Command.Group heading={t.palette.records} className={GROUP}>
                {results.records.map((entry) => (
                  <PalettePageItem key={entry.page.id} entry={entry} onOpen={openPage} />
                ))}
              </Command.Group>
            ) : null}
          </>
        ) : recent.length ? (
          <Command.Group heading={t.palette.recent} className={GROUP}>
            {recent.map((entry) => (
              <PalettePageItem key={entry.page.id} entry={entry} onOpen={openPage} />
            ))}
          </Command.Group>
        ) : null}

        <PaletteActions className={GROUP} search={search} onDone={close} />
      </Command.List>
      <div className="border-divider text-muted-foreground flex items-center gap-4 border-t px-4 py-2 text-xs">
        <span>
          <kbd className="font-mono">↑↓</kbd> {t.palette.hintMove}
        </span>
        <span>
          <kbd className="font-mono">↵</kbd> {t.palette.hintOpen}
        </span>
        <span>
          <kbd className="font-mono">esc</kbd> {t.palette.hintClose}
        </span>
      </div>
    </Command.Dialog>
  );
}
