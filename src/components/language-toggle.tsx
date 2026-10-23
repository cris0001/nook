import { Check, ChevronDown } from 'lucide-react';

import { Flag } from '@/components/flags';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCommonTranslation } from '@/lib/i18n/common';
import { cn } from '@/lib/utils';
import { LOCALES, useLocaleStore } from '@/stores/locale.store';

// UI language picker: the trigger shows the current language's flag and code; the menu
// lists every language by its own name. Applies app-wide immediately.
export function LanguageToggle({ className }: { className?: string }) {
  const t = useCommonTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.language}
        title={t.language}
        className={cn(
          'hover:bg-hover data-[state=open]:bg-hover flex h-9 items-center gap-2 rounded-sm px-2 text-xs font-medium',
          className,
        )}
      >
        <Flag locale={locale} />
        <span className="font-mono">{current?.label}</span>
        <ChevronDown className="text-muted-foreground size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="min-w-40">
        {LOCALES.map(({ code, name }) => (
          <DropdownMenuItem key={code} onSelect={() => setLocale(code)}>
            <Flag locale={code} />
            {name}
            {code === locale ? <Check className="ml-auto" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
