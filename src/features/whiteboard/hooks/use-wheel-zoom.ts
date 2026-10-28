import { useEffect } from 'react';

import { useWhiteboardStore } from '../stores/whiteboard.store';
import { zoomAt } from '../utils/geometry';

// Wheel pans; ctrl/⌘ + wheel (and trackpad pinch, which arrives as ctrl + wheel) zooms
// around the pointer. Registered by hand because React's wheel listener is passive.
export function useWheelZoom(element: SVGSVGElement | null) {
  useEffect(() => {
    if (!element) return;
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const { camera, setCamera } = useWhiteboardStore.getState();
      if (event.ctrlKey || event.metaKey) {
        const rect = element?.getBoundingClientRect();
        const sx = event.clientX - (rect?.left ?? 0);
        const sy = event.clientY - (rect?.top ?? 0);
        setCamera(zoomAt(camera, sx, sy, camera.zoom * Math.exp(-event.deltaY * 0.01)));
      } else {
        setCamera({ ...camera, x: camera.x - event.deltaX, y: camera.y - event.deltaY });
      }
    }
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [element]);
}
