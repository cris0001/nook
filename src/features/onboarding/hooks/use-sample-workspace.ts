import { useEffect } from 'react';

import { listPages } from '@/lib/data/pages';

import { seedSampleWorkspace } from '../api/seed-sample';
import { useOnboardingTranslation } from '../i18n';

const SEEDED_KEY = 'nook-sample-seeded';

let started = false;

function alreadySeeded(): boolean {
  try {
    return localStorage.getItem(SEEDED_KEY) !== null;
  } catch {
    return true;
  }
}

// Fills a brand-new workspace once, so a first visit shows the app working instead of
// an empty sidebar. The flag (not "no pages") decides: someone who deletes everything
// on purpose must not get the samples back. `started` guards StrictMode's double run.
export function useSampleWorkspace() {
  useEffect(() => {
    if (started || alreadySeeded()) return;
    started = true;
    void (async () => {
      localStorage.setItem(SEEDED_KEY, String(Date.now()));
      if ((await listPages()).length === 0) {
        await seedSampleWorkspace(useOnboardingTranslation.peek());
      }
    })();
  }, []);
}
