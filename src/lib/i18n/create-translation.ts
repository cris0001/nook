import { useLocaleStore, type Locale } from '@/stores/locale.store';

export function createTranslation<T>(dict: Record<Locale, T>) {
  function useScopedTranslation(): T {
    const locale = useLocaleStore((s) => s.locale);
    return dict[locale];
  }
  useScopedTranslation.peek = (): T => dict[useLocaleStore.getState().locale];
  return useScopedTranslation;
}
