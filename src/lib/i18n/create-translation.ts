import { useLocaleStore, type Locale } from '@/stores/locale.store';

// Builds a scoped translation hook from a per-locale dictionary. Each feature owns its
// strings (features/<name>/i18n.ts) so the copy lives next to the code that uses it
// and namespaces never collide. English is the source shape; every other locale must
// match it. The active locale comes from the shared locale store. `peek()` reads the
// current strings outside React (e.g. inside editor plugins that run on their own).
export function createTranslation<T>(dict: Record<Locale, T>) {
  function useScopedTranslation(): T {
    const locale = useLocaleStore((s) => s.locale);
    return dict[locale];
  }
  useScopedTranslation.peek = (): T => dict[useLocaleStore.getState().locale];
  return useScopedTranslation;
}
