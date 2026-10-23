import { useCommonTranslation } from '@/lib/i18n/common';
import { cn } from '@/lib/utils';
import { LOCALES, useLocaleStore } from '@/stores/locale.store';

// A compact EN/PL segmented switch for the UI language. Applies app-wide immediately.
export function LanguageToggle({ className }: { className?: string }) {
  const t = useCommonTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  return (
    <div
      role="group"
      aria-label={t.language}
      className={cn('bg-muted flex items-center rounded-full p-0.5', className)}
    >
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
            locale === code ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
