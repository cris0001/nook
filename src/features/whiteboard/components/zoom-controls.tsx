import { Download, Maximize, Minus, Plus } from 'lucide-react';

import { useWhiteboardTranslation } from '../i18n';
import { useWhiteboardStore } from '../stores/whiteboard.store';
import { bounds, zoomAt } from '../utils/geometry';

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

  function fit() {
    const { elements } = useWhiteboardStore.getState();
    if (!elements.length) return setCamera({ x: 0, y: 0, zoom: 1 });
    const boxes = elements.map(bounds);
    const minX = Math.min(...boxes.map((b) => b.x));
    const minY = Math.min(...boxes.map((b) => b.y));
    const width = Math.max(...boxes.map((b) => b.x + b.width)) - minX;
    const height = Math.max(...boxes.map((b) => b.y + b.height)) - minY;
    const roomX = size.width - Math.min(120, size.width * 0.12);
    const roomY = size.height - Math.min(160, size.height * 0.25);
    const zoom = Math.min(2, Math.max(0.2, Math.min(roomX / width, roomY / height)));
    setCamera({
      zoom,
      x: size.width / 2 - (minX + width / 2) * zoom,
      y: size.height / 2 - (minY + height / 2) * zoom,
    });
  }

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
