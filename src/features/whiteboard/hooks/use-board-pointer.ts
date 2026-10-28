import { useRef, useState, type MouseEvent, type PointerEvent } from 'react';

import type { BoardElement } from '@/schemas/scene.schema';

import { useWhiteboardStore } from '../stores/whiteboard.store';
import { extendElement, finishElement, newElement } from '../utils/create-element';
import {
  bounds,
  dragHandle,
  hitTest,
  intersects,
  moveElement,
  normalize,
  resizeElement,
  toWorld,
  type Box,
  type Camera,
  type Handle,
} from '../utils/geometry';
import { HANDLES, handlePoint } from '../components/selection-overlay';

type Gesture =
  | { kind: 'pan'; sx: number; sy: number; camera: Camera }
  | { kind: 'draw'; id: string; before: BoardElement[] }
  | { kind: 'move'; wx: number; wy: number; before: BoardElement[]; moved: boolean }
  | { kind: 'resize'; handle: Handle; from: Box; original: BoardElement; before: BoardElement[] }
  | { kind: 'erase'; before: BoardElement[]; removed: boolean }
  | { kind: 'marquee'; wx: number; wy: number };

const store = useWhiteboardStore.getState;

function topHit(elements: BoardElement[], wx: number, wy: number, zoom: number) {
  return [...elements].reverse().find((element) => hitTest(element, wx, wy, 6 / zoom));
}

export function useBoardPointer(editable: boolean, spaceDown: () => boolean) {
  const gesture = useRef<Gesture | null>(null);
  const [marquee, setMarquee] = useState<Box | null>(null);

  function local(event: MouseEvent<SVGSVGElement>): [number, number] {
    const rect = event.currentTarget.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  function onPointerDown(event: PointerEvent<SVGSVGElement>) {
    if (store().editingTextId) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const [sx, sy] = local(event);
    const { tool, camera, elements, selected, style } = store();
    const [wx, wy] = toWorld(camera, sx, sy);
    const pressure = event.pointerType === 'pen' ? event.pressure : 0.5;

    if (event.button === 1 || tool === 'hand' || spaceDown() || !editable) {
      gesture.current = { kind: 'pan', sx, sy, camera };
      return;
    }
    if (tool === 'eraser') {
      gesture.current = { kind: 'erase', before: elements, removed: false };
      erase(wx, wy);
      return;
    }
    if (tool === 'select') {
      const only = selected.length === 1 ? elements.find((e) => e.id === selected[0]) : undefined;
      const handle =
        only &&
        HANDLES.find((h) => {
          const [hx, hy] = handlePoint(bounds(only), h, 6 / camera.zoom);
          return Math.hypot(hx - wx, hy - wy) <= 8 / camera.zoom;
        });
      if (only && handle) {
        gesture.current = {
          kind: 'resize',
          handle,
          from: bounds(only),
          original: only,
          before: elements,
        };
        return;
      }
      const hit = topHit(elements, wx, wy, camera.zoom);
      if (!hit) {
        if (!event.shiftKey) store().select([]);
        gesture.current = { kind: 'marquee', wx, wy };
        return;
      }
      if (!selected.includes(hit.id))
        store().select(event.shiftKey ? [...selected, hit.id] : [hit.id]);
      gesture.current = { kind: 'move', wx, wy, before: elements, moved: false };
      return;
    }
    const element = newElement(tool, style, wx, wy, pressure);
    if (!element) return;
    if (element.type === 'text') {
      store().preview([...elements, element]);
      store().setEditingText(element.id);
      return;
    }
    store().preview([...elements, element]);
    gesture.current = { kind: 'draw', id: element.id, before: elements };
  }

  function erase(wx: number, wy: number) {
    const { elements, camera } = store();
    const hit = topHit(elements, wx, wy, camera.zoom);
    if (!hit || gesture.current?.kind !== 'erase') return;
    gesture.current.removed = true;
    store().preview(elements.filter((e) => e.id !== hit.id));
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const current = gesture.current;
    if (!current) return;
    const [sx, sy] = local(event);
    const { camera, elements, selected } = store();
    const [wx, wy] = toWorld(camera, sx, sy);

    if (current.kind === 'pan') {
      store().setCamera({
        ...current.camera,
        x: current.camera.x + sx - current.sx,
        y: current.camera.y + sy - current.sy,
      });
    } else if (current.kind === 'draw') {
      const pressure = event.pointerType === 'pen' ? event.pressure : 0.5;
      store().preview(
        elements.map((e) => (e.id === current.id ? extendElement(e, wx, wy, pressure) : e)),
      );
    } else if (current.kind === 'move') {
      const [ox, oy] = [wx - current.wx, wy - current.wy];
      current.moved = true;
      store().preview(
        current.before.map((e) => (selected.includes(e.id) ? moveElement(e, ox, oy) : e)),
      );
    } else if (current.kind === 'resize') {
      const to = dragHandle(current.from, current.handle, wx, wy);
      store().preview(
        elements.map((e) =>
          e.id === current.original.id ? resizeElement(current.original, current.from, to) : e,
        ),
      );
    } else if (current.kind === 'erase') {
      erase(wx, wy);
    } else {
      setMarquee(
        normalize({
          x: current.wx,
          y: current.wy,
          width: wx - current.wx,
          height: wy - current.wy,
        }),
      );
    }
  }

  function onPointerUp() {
    const current = gesture.current;
    gesture.current = null;
    if (!current) return;
    const { elements, tool } = store();
    if (current.kind === 'draw') {
      const element = elements.find((e) => e.id === current.id);
      const done = element && finishElement(element);
      if (!done) return store().preview(current.before);
      store().commit(
        current.before,
        elements.map((e) => (e.id === done.id ? done : e)),
      );
      if (tool !== 'pen') {
        store().setTool('select');
        store().select([done.id]);
      }
    } else if (current.kind === 'move' && current.moved) {
      store().commit(current.before);
    } else if (current.kind === 'resize' || (current.kind === 'erase' && current.removed)) {
      store().commit(current.before);
    } else if (current.kind === 'marquee') {
      if (marquee)
        store().select(elements.filter((e) => intersects(bounds(e), marquee)).map((e) => e.id));
      setMarquee(null);
    }
  }

  function onDoubleClick(event: MouseEvent<SVGSVGElement>) {
    if (!editable) return;
    const [sx, sy] = local(event);
    const { camera, elements } = store();
    const [wx, wy] = toWorld(camera, sx, sy);
    const hit = topHit(elements, wx, wy, camera.zoom);
    if (hit?.type === 'text') store().setEditingText(hit.id);
  }

  return { marquee, onPointerDown, onPointerMove, onPointerUp, onDoubleClick };
}
