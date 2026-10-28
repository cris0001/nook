import { toast } from 'sonner';

import { useCommonTranslation } from '@/lib/i18n/common';

// Writes are fire-and-forget (`void save()`), so a failed one — full storage, private
// mode, a closed database — would otherwise vanish silently.
export function reportUnhandledErrors(): void {
  window.addEventListener('unhandledrejection', (event) => {
    console.error(event.reason);
    const t = useCommonTranslation.peek();
    const quota = event.reason instanceof Error && /quota/i.test(event.reason.name);
    toast.error(quota ? t.errors.storageFull : t.errors.saveFailed, { id: 'save-error' });
  });
}

// Without this the browser may evict IndexedDB under storage pressure (Safari also
// clears sites unused for 7 days) — and here that is the only copy of the workspace.
export function requestPersistentStorage(): void {
  void navigator.storage?.persist?.().catch(() => undefined);
}
