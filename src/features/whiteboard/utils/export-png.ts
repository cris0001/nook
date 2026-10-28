import type { BoardElement } from '@/schemas/scene.schema';

import { bounds } from './geometry';

const PAD = 32;
const SCALE = 2;

// Copies the drawing layer of the live SVG, bakes the theme colors into it (the export
// has no stylesheet) and rasterises it at 2× onto the page background color.
export async function exportPng(
  svg: SVGSVGElement,
  elements: BoardElement[],
  name: string,
): Promise<void> {
  const layer = svg.querySelector<SVGGElement>('[data-layer="elements"]');
  if (!layer || elements.length === 0) return;
  const boxes = elements.map(bounds);
  const minX = Math.min(...boxes.map((b) => b.x)) - PAD;
  const minY = Math.min(...boxes.map((b) => b.y)) - PAD;
  const width = Math.max(...boxes.map((b) => b.x + b.width)) - minX + PAD;
  const height = Math.max(...boxes.map((b) => b.y + b.height)) - minY + PAD;

  const copy = layer.cloneNode(true) as SVGGElement;
  const originals = [layer, ...layer.querySelectorAll('*')];
  [copy, ...copy.querySelectorAll('*')].forEach((node, i) => {
    const source = originals[i];
    if (!(source instanceof Element) || !(node instanceof SVGElement)) return;
    const style = getComputedStyle(source);
    node.setAttribute('fill', style.fill);
    node.setAttribute('stroke', style.stroke);
    node.setAttribute('font-family', style.fontFamily);
    node.setAttribute('font-weight', style.fontWeight);
    node.removeAttribute('class');
  });
  copy.removeAttribute('transform');

  const background = getComputedStyle(document.body).backgroundColor;
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}"><rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${background}"/>${copy.outerHTML}</svg>`;
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = width * SCALE;
  canvas.height = height * SCALE;
  canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
  const link = document.createElement('a');
  link.download = `${name || 'whiteboard'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
