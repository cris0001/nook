import type { BoardElement } from '@/schemas/scene.schema';

import type { SampleCopy } from '../i18n';

let seed = 7;
const base = (x: number, y: number) => ({
  id: crypto.randomUUID(),
  x,
  y,
  stroke: 'ink' as const,
  strokeWidth: 2 as const,
  seed: (seed += 101),
});

export function sitemapSketch(copy: SampleCopy['sketch']): BoardElement[] {
  const home: BoardElement[] = [
    { ...base(320, 60), type: 'rectangle', width: 200, height: 80, fill: 'green' },
    { ...base(370, 86), type: 'text', text: copy.home, fontSize: 22 },
  ];
  const children = copy.pages.flatMap((label, i): BoardElement[] => {
    const x = 80 + i * 260;
    return [
      {
        ...base(x, 260),
        type: 'rectangle',
        width: 180,
        height: 70,
        fill: i === 0 ? 'yellow' : null,
      },
      { ...base(x + 30, 282), type: 'text', text: label, fontSize: 20 },
      {
        ...base(420, 140),
        type: 'arrow',
        points: [
          [0, 0],
          [x + 90 - 420, 116],
        ],
      },
    ];
  });
  const note: BoardElement[] = [
    { ...base(720, 70), type: 'text', text: copy.note, fontSize: 18, stroke: 'blue' },
    {
      ...base(700, 100),
      type: 'arrow',
      points: [
        [0, 0],
        [-160, 0],
      ],
      stroke: 'blue',
    },
  ];
  return [...home, ...children, ...note];
}
