import { useEffect, useState } from 'react';

import { useWhiteboardTranslation } from '../i18n';
import { useSceneSync } from '../hooks/use-scene-sync';
import { useWhiteboardStore } from '../stores/whiteboard.store';
import { exportPng } from '../utils/export-png';
import { Board } from './board';
import { BoardToolbar } from './board-toolbar';
import { StylePanel } from './style-panel';
import { ZoomControls } from './zoom-controls';

export function WhiteboardView({
  pageId,
  title,
  editable,
}: {
  pageId: string;
  title: string;
  editable: boolean;
}) {
  const t = useWhiteboardTranslation();
  const ready = useSceneSync(pageId);
  const empty = useWhiteboardStore((s) => s.elements.length === 0);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [container]);

  useEffect(() => {
    if (!editable) useWhiteboardStore.getState().setTool('hand');
  }, [editable]);

  return (
    <div
      ref={setContainer}
      className="border-divider relative mt-6 h-[calc(100dvh-16rem)] min-h-[26rem] overflow-hidden rounded-xl border"
    >
      {ready ? (
        <>
          <Board editable={editable} onSvg={setSvg} />
          {editable ? <BoardToolbar /> : null}
          {editable ? <StylePanel /> : null}
          <ZoomControls
            size={size}
            onExport={() => {
              if (svg) void exportPng(svg, useWhiteboardStore.getState().elements, title);
            }}
          />
          {empty ? (
            <p className="text-muted-foreground pointer-events-none absolute inset-x-0 top-1/2 text-center text-sm">
              {editable ? t.emptyHint : t.emptyReadOnly}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
