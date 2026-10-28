import { useNavigate } from '@tanstack/react-router';
import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

import { useCan } from '@/hooks/use-can';
import { exportWorkspace, importWorkspace } from '@/lib/data/backup';
import { useCommonTranslation } from '@/lib/i18n/common';
import { useConfirm } from '@/stores/confirm.store';
import { todayKey } from '@/utils/dates';

const ROW = 'hover:bg-hover flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm';

export function WorkspaceBackup() {
  const t = useCommonTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const canImport = useCan('workspace.manage');
  const fileInput = useRef<HTMLInputElement>(null);

  async function download() {
    const backup = await exportWorkspace();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nook-${todayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast(t.backup.exported(backup.pages.length));
  }

  async function upload(file: File) {
    const ok = await confirm({
      title: t.backup.confirmTitle,
      description: t.backup.confirmBody,
      confirmText: t.backup.import,
      destructive: true,
    });
    if (!ok) return;
    let data: unknown;
    try {
      data = JSON.parse(await file.text());
    } catch {
      toast.error(t.backup.invalid);
      return;
    }
    const result = await importWorkspace(data);
    if (!result.ok) {
      toast.error(t.backup.invalid);
      return;
    }
    await navigate({ to: '/' });
    toast(t.backup.imported(result.pages));
  }

  return (
    <div>
      <p className="eyebrow px-2 pt-2 pb-1.5">{t.backup.title}</p>
      <button type="button" onClick={() => void download()} className={ROW}>
        <Download className="text-muted-foreground size-4" />
        {t.backup.export}
      </button>
      {canImport ? (
        <>
          <button type="button" onClick={() => fileInput.current?.click()} className={ROW}>
            <Upload className="text-muted-foreground size-4" />
            {t.backup.import}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) void upload(file);
            }}
          />
        </>
      ) : null}
    </div>
  );
}
