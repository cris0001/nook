import { useNavigate } from '@tanstack/react-router';
import { Command } from 'cmdk';
import {
  Database,
  FilePlus,
  House,
  Languages,
  Monitor,
  Moon,
  Sun,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

import { useCan } from '@/hooks/use-can';
import { LOCALES, useLocaleStore } from '@/stores/locale.store';
import { useThemeStore, type Theme } from '@/stores/theme.store';

import { useCreatePage } from '../hooks/use-create-page';
import { usePagesTranslation } from '../i18n';
import { PALETTE_ITEM } from './palette-page-item';

const THEME_ICON: Record<Theme, LucideIcon> = { system: Monitor, light: Sun, dark: Moon };

interface Action {
  id: string;
  label: string;
  Icon: LucideIcon;
  run: () => void;
}

export function PaletteActions({ className, onDone }: { className: string; onDone: () => void }) {
  const t = usePagesTranslation();
  const navigate = useNavigate();
  const createPage = useCreatePage();
  const canCreate = useCan('page.create');
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const other = LOCALES.find((l) => l.code !== locale);

  const actions: Action[] = [
    ...(canCreate
      ? [
          {
            id: 'new-page',
            label: t.palette.newPage,
            Icon: FilePlus,
            run: () => void createPage({ parentId: null, type: 'document' }),
          },
          {
            id: 'new-database',
            label: t.palette.newDatabase,
            Icon: Database,
            run: () => void createPage({ parentId: null, type: 'database' }),
          },
        ]
      : []),
    { id: 'today', label: t.palette.goToday, Icon: House, run: () => void navigate({ to: '/' }) },
    {
      id: 'trash',
      label: t.palette.goTrash,
      Icon: Trash2,
      run: () => void navigate({ to: '/trash' }),
    },
    ...(['light', 'dark', 'system'] as const)
      .filter((option) => option !== theme)
      .map((option) => ({
        id: `theme-${option}`,
        label: t.palette.theme[option],
        Icon: THEME_ICON[option],
        run: () => setTheme(option),
      })),
    ...(other
      ? [
          {
            id: 'language',
            label: t.palette.language(other.name),
            Icon: Languages,
            run: () => setLocale(other.code),
          },
        ]
      : []),
  ];

  return (
    <Command.Group heading={t.palette.actions} className={className}>
      {actions.map(({ id, label, Icon, run }) => (
        <Command.Item
          key={id}
          value={id}
          keywords={[label]}
          onSelect={() => {
            onDone();
            run();
          }}
          className={PALETTE_ITEM}
        >
          <Icon className="text-muted-foreground size-4 shrink-0" />
          {label}
        </Command.Item>
      ))}
    </Command.Group>
  );
}
