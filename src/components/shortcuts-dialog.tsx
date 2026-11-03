import { Dialog } from 'radix-ui';
import { useEffect } from 'react';

import { useCommonTranslation } from '@/lib/i18n/common';
import { useShortcutsStore } from '@/stores/shortcuts.store';
import { MOD, SHIFT } from '@/utils/platform';
import { isTypingTarget } from '@/utils/typing-target';

function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="flex shrink-0 gap-1">
      {keys.map((key) => (
        <kbd
          key={key}
          className="bg-surface text-foreground min-w-6 rounded border border-b-2 px-1.5 text-center font-mono text-[11px] leading-5"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}

export function ShortcutsDialog() {
  const t = useCommonTranslation();
  const open = useShortcutsStore((s) => s.open);
  const setOpen = useShortcutsStore((s) => s.setOpen);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '?' || event.metaKey || event.ctrlKey || isTypingTarget(event.target))
        return;
      event.preventDefault();
      setOpen(true);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setOpen]);

  const groups: [string, [string, string[]][]][] = [
    [
      t.shortcuts.general,
      [
        [t.shortcuts.palette, [MOD, 'K']],
        [t.shortcuts.help, ['?']],
        [t.shortcuts.close, ['Esc']],
      ],
    ],
    [
      t.shortcuts.writing,
      [
        [t.shortcuts.blocks, ['/']],
        [t.shortcuts.bold, [MOD, 'B']],
        [t.shortcuts.italic, [MOD, 'I']],
        [t.shortcuts.underline, [MOD, 'U']],
        [t.shortcuts.strike, [MOD, SHIFT, 'S']],
        [t.shortcuts.code, [MOD, 'E']],
        [t.shortcuts.link, [MOD, 'K']],
        [t.shortcuts.undo, [MOD, 'Z']],
        [t.shortcuts.redo, [MOD, SHIFT, 'Z']],
      ],
    ],
    [
      t.shortcuts.markdown,
      [
        [t.shortcuts.heading, ['#', '␣']],
        [t.shortcuts.bullet, ['-', '␣']],
        [t.shortcuts.numbered, ['1.', '␣']],
        [t.shortcuts.todo, ['[]', '␣']],
        [t.shortcuts.quote, ['>', '␣']],
        [t.shortcuts.codeBlock, ['```']],
      ],
    ],
    [
      t.shortcuts.pages,
      [
        [t.shortcuts.titleToBody, ['Enter']],
        [t.shortcuts.rename, [t.shortcuts.doubleClick]],
        [t.shortcuts.dragKeys, ['␣', '↑↓←→', '␣']],
      ],
    ],
    [
      t.shortcuts.calendar,
      [
        [t.shortcuts.calendarStep, ['←', '→']],
        [t.shortcuts.calendarToday, ['T']],
      ],
    ],
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/25 animate-[fade-in_120ms_ease-out]" />
        <Dialog.Content className="bg-background shadow-raised fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl p-6 outline-none">
          <Dialog.Title className="font-heading text-xl font-bold">
            {t.shortcuts.title}
          </Dialog.Title>
          <Dialog.Description className="text-muted-foreground mt-1 text-sm">
            {t.shortcuts.description}
          </Dialog.Description>
          <div className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {groups.map(([title, rows]) => (
              <section key={title}>
                <h3 className="eyebrow mb-2">{title}</h3>
                <ul className="divide-divider divide-y">
                  {rows.map(([label, keys]) => (
                    <li key={label} className="flex h-9 items-center justify-between gap-4 text-sm">
                      {label}
                      <Keys keys={keys} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
