import { useNavigate } from '@tanstack/react-router';
import { Eraser, FlaskConical, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useCan } from '@/hooks/use-can';
import { clearWorkspace } from '@/lib/data/bulk';
import { useConfirm } from '@/stores/confirm.store';

import { addDemoWorkspace, addStressWorkspace } from '../api/demo-data';
import { useDemoTranslation } from '../demo-copy';
import { useOnboardingTranslation } from '../i18n';

const ROW =
  'hover:bg-hover flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm disabled:opacity-50';

export function DemoDataActions() {
  const t = useOnboardingTranslation();
  const copy = useDemoTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const canManage = useCan('workspace.manage');
  const [busy, setBusy] = useState(false);

  if (!canManage) return null;

  async function run(task: () => Promise<string>) {
    setBusy(true);
    const started = performance.now();
    try {
      const message = await task();
      toast(t.data.done(message, ((performance.now() - started) / 1000).toFixed(1)));
    } finally {
      setBusy(false);
    }
  }

  async function stress() {
    const ok = await confirm({
      title: t.data.stressTitle,
      description: t.data.stressBody,
      confirmText: t.data.stressConfirm,
    });
    if (ok) await run(async () => t.data.stressAdded(await addStressWorkspace()));
  }

  async function clear() {
    const ok = await confirm({
      title: t.data.clearTitle,
      description: t.data.clearBody,
      confirmText: t.data.clear,
      destructive: true,
    });
    if (!ok) return;
    await clearWorkspace();
    await navigate({ to: '/' });
  }

  return (
    <div>
      <p className="eyebrow px-2 pt-2 pb-1.5">{t.data.title}</p>
      <button
        type="button"
        disabled={busy}
        onClick={() =>
          void run(async () => {
            await addDemoWorkspace(copy);
            return t.data.demoAdded;
          })
        }
        className={ROW}
      >
        <Sparkles className="text-muted-foreground size-4" />
        {t.data.demo}
      </button>
      <button type="button" disabled={busy} onClick={() => void stress()} className={ROW}>
        <FlaskConical className="text-muted-foreground size-4" />
        {busy ? t.data.working : t.data.stress}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => void clear()}
        className={`${ROW} text-destructive`}
      >
        <Eraser className="size-4" />
        {t.data.clear}
      </button>
    </div>
  );
}
