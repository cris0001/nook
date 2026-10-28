import { Check, ChevronsUpDown, Monitor, Moon, Sun } from 'lucide-react';

import { Flag } from '@/components/flags';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WorkspaceBackup } from '@/components/workspace-backup';
import { useCommonTranslation } from '@/lib/i18n/common';
import { ROLES } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { LOCALES, useLocaleStore } from '@/stores/locale.store';
import { useProfileStore } from '@/stores/profile.store';
import { useThemeStore, type Theme } from '@/stores/theme.store';

const THEMES: { theme: Theme; Icon: typeof Sun }[] = [
  { theme: 'system', Icon: Monitor },
  { theme: 'light', Icon: Sun },
  { theme: 'dark', Icon: Moon },
];

const SEGMENT = 'flex h-7 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium';

function initialsOf(name: string, fallback: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length ? words.slice(0, 2).map((w) => w[0]) : [fallback[0]];
  return letters.join('').toUpperCase();
}

export function ProfileMenu() {
  const t = useCommonTranslation();
  const { name, role, setName, setRole } = useProfileStore();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const shownName = name.trim() || t.profile.you;

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t.profile.label}
        className="hover:bg-hover data-[state=open]:bg-background data-[state=open]:shadow-raised flex h-12 w-full items-center gap-2.5 rounded-lg px-2 text-left"
      >
        <span className="bg-primary-tint text-primary-tint-foreground font-heading flex size-8 shrink-0 items-center justify-center rounded-[9px] text-xs font-bold [font-variation-settings:'opsz'_96]">
          {initialsOf(name, t.profile.you)}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-semibold">{shownName}</span>
          <span className="eyebrow text-[10px]">{t.role.names[role]}</span>
        </span>
        <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-68 p-1.5">
        <input
          defaultValue={name}
          placeholder={t.profile.namePlaceholder}
          aria-label={t.profile.namePlaceholder}
          onChange={(event) => setName(event.target.value)}
          className="focus:border-primary mb-1.5 h-9 w-full rounded-md border bg-transparent px-2.5 text-sm font-medium outline-none"
        />

        <p className="eyebrow px-2 pt-2 pb-1.5">{t.profile.viewAs}</p>
        {ROLES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setRole(code)}
            className={cn(
              'hover:bg-hover flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left',
              code === role && 'bg-hover',
            )}
          >
            <span className="flex-1">
              <span className="block text-sm">{t.role.names[code]}</span>
              <span className="text-muted-foreground block text-xs">
                {t.role.descriptions[code]}
              </span>
            </span>
            {code === role ? <Check className="text-primary-text mt-0.5 size-4" /> : null}
          </button>
        ))}

        <div className="border-divider my-1.5 border-t" />
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <span className="text-sm">{t.language}</span>
          <div className="bg-well flex rounded-lg p-0.5">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                aria-pressed={code === locale}
                onClick={() => setLocale(code)}
                className={cn(
                  SEGMENT,
                  'font-mono',
                  code === locale ? 'bg-background shadow-raised' : 'text-foreground/70',
                )}
              >
                <Flag locale={code} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <span className="text-sm">{t.profile.themeLabel}</span>
          <div className="bg-well flex rounded-lg p-0.5">
            {THEMES.map(({ theme: option, Icon }) => (
              <button
                key={option}
                type="button"
                aria-label={t.theme[option]}
                title={t.theme[option]}
                aria-pressed={option === theme}
                onClick={() => setTheme(option)}
                className={cn(
                  SEGMENT,
                  option === theme ? 'bg-background shadow-raised' : 'text-foreground/70',
                )}
              >
                <Icon className="size-3.5" />
              </button>
            ))}
          </div>
        </div>
        <div className="border-divider my-1.5 border-t" />
        <WorkspaceBackup />
      </PopoverContent>
    </Popover>
  );
}
