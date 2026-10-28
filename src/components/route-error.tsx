import { BrandMark } from '@/components/brand';
import { useCommonTranslation } from '@/lib/i18n/common';

export function RouteError({ error }: { error: unknown }) {
  const t = useCommonTranslation();
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center gap-4 px-6 sm:px-12">
      <BrandMark eyesOnly mood="asleep" className="text-5xl" />
      <h1 className="font-heading text-2xl font-bold">{t.errors.screenTitle}</h1>
      <p className="text-muted-foreground max-w-md text-sm">{t.errors.screenBody}</p>
      <pre className="text-muted-foreground bg-surface max-w-full overflow-x-auto rounded-md px-3 py-2 font-mono text-xs">
        {message}
      </pre>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn-primary h-9 px-3 text-sm"
      >
        {t.errors.reload}
      </button>
    </div>
  );
}
