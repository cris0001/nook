import { useState } from 'react';

import { cn } from '@/lib/utils';

import { useBoardKeys } from '../hooks/use-board-keys';
import { useBoardPointer } from '../hooks/use-board-pointer';
import { useWheelZoom } from '../hooks/use-wheel-zoom';
import { useWhiteboardStore } from '../stores/whiteboard.store';
import { ElementShape } from './element-shape';
import { SelectionOverlay } from './selection-overlay';
import { TextEditor } from './text-editor';

const CURSOR = {
  select: 'cursor-default',
  hand: 'cursor-grab active:cursor-grabbing',
  eraser: 'cursor-cell',
  text: 'cursor-text',
} as const;

export function Board({
  editable,
  onSvg,
}: {
  editable: boolean;
  onSvg: (svg: SVGSVGElement | null) => void;
}) {
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);
  const elements = useWhiteboardStore((s) => s.elements);
  const selected = useWhiteboardStore((s) => s.selected);
  const camera = useWhiteboardStore((s) => s.camera);
  const tool = useWhiteboardStore((s) => s.tool);
  const editingId = useWhiteboardStore((s) => s.editingTextId);
  const spaceDown = useBoardKeys(editable);
  const pointer = useBoardPointer(editable, spaceDown);
  useWheelZoom(svg);

  const editing = elements.find((e) => e.id === editingId);
  const grid = 24 * camera.zoom;

  return (
    <div
      className="bg-surface absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
        backgroundSize: `${grid}px ${grid}px`,
        backgroundPosition: `${camera.x}px ${camera.y}px`,
      }}
    >
      <svg
        ref={(element) => {
          setSvg(element);
          onSvg(element);
        }}
        className={cn(
          'absolute inset-0 size-full touch-none select-none',
          !editable ? CURSOR.hand : (CURSOR[tool as keyof typeof CURSOR] ?? 'cursor-crosshair'),
        )}
        onPointerDown={pointer.onPointerDown}
        onPointerMove={pointer.onPointerMove}
        onPointerUp={pointer.onPointerUp}
        onPointerCancel={pointer.onPointerUp}
        onDoubleClick={pointer.onDoubleClick}
      >
        <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.zoom})`}>
          <g data-layer="elements">
            {elements.map((element) => (
              <ElementShape key={element.id} element={element} hidden={element.id === editingId} />
            ))}
          </g>
          <SelectionOverlay
            elements={elements.filter((e) => selected.includes(e.id))}
            zoom={camera.zoom}
          />
          {pointer.marquee ? (
            <rect
              {...pointer.marquee}
              vectorEffect="non-scaling-stroke"
              strokeWidth={1}
              className="fill-primary/10 stroke-primary"
            />
          ) : null}
        </g>
      </svg>
      {editing?.type === 'text' ? <TextEditor key={editing.id} element={editing} /> : null}
    </div>
  );
}
