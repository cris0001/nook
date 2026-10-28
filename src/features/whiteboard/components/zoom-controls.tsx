import { Download, Maximize, Minus, Plus } from 'lucide-react';

import { useWhiteboardTranslation } from '../i18n';
import { useWhiteboardStore } from '../stores/whiteboard.store';
import { fitCamera } from '../utils/fit';
import { zoomAt } from '../utils/geometry';

const BUTTON = 'hover:bg-hover flex size-8 items-center justify-center rounded-md';

export function ZoomControls({
  size,
  onExport,
}: {
  size: { width: number; height: number };
  onExport: () => void;
}) {
  const t = useWhiteboardTranslation();
  const camera = useWhiteboardStore((s) => s.camera);
  const setCamera = useWhiteboardStore((s) => s.setCamera);
  const hasElements = useWhiteboardStore((s) => s.elements.length > 0);
  const zoomBy = (factor: number) =>
    setCamera(zoomAt(camera, size.width / 2, size.height / 2, camera.zoom * factor));

  const fit = () => setCamera(fitCamera(useWhiteboardStore.getState().elements, size));

  return (
    <div className="bg-background shadow-raised absolute right-3 bottom-3 z-10 flex items-center gap-0.5 rounded-xl p-1">
      <button
        type="button"
        aria-label={t.zoomOut}
        title={t.zoomOut}
        onClick={() => zoomBy(1 / 1.2)}
        className={BUTTON}
      >
        <Minus className="size-4" />
      </button>
      <button
        type="button"
        title={t.resetZoom}
        onClick={() => setCamera(zoomAt(camera, size.width / 2, size.height / 2, 1))}
        className="hover:bg-hover h-8 min-w-12 rounded-md px-1 font-mono text-[11px] tabular-nums"
      >
        {Math.round(camera.zoom * 100)}%
      </button>
      <button
        type="button"
        aria-label={t.zoomIn}
        title={t.zoomIn}
        onClick={() => zoomBy(1.2)}
        className={BUTTON}
      >
        <Plus className="size-4" />
      </button>
      <button type="button" aria-label={t.fit} title={t.fit} onClick={fit} className={BUTTON}>
        <Maximize className="size-4" />
      </button>
      <span aria-hidden className="bg-border mx-1 h-5 w-px" />
      <button
        type="button"
        aria-label={t.export}
        title={t.export}
        disabled={!hasElements}
        onClick={onExport}
        className={`${BUTTON} disabled:opacity-35`}
      >
        <Download className="size-4" />
      </button>
    </div>
  );
}
