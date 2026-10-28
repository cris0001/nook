import { z } from 'zod';

import { OptionColorSchema } from './database.schema';

// Colors are names, like database tags: 'ink' follows the text color, the rest map to
// the theme's dot tokens, so a drawing reads in light and dark mode alike.
export const InkSchema = z.union([z.literal('ink'), OptionColorSchema]);
export const STROKE_WIDTHS = [1, 2, 4] as const;

const Base = z.object({
  id: z.string().min(1),
  x: z.number(),
  y: z.number(),
  stroke: InkSchema,
  strokeWidth: z.union([z.literal(1), z.literal(2), z.literal(4)]),
  // Keeps the hand-drawn wobble identical on every render.
  seed: z.number().int(),
});

const Box = Base.extend({
  width: z.number(),
  height: z.number(),
  fill: InkSchema.nullable(),
});

export const ElementSchema = z.discriminatedUnion('type', [
  Box.extend({ type: z.literal('rectangle') }),
  Box.extend({ type: z.literal('ellipse') }),
  // Points are relative to (x, y).
  Base.extend({ type: z.literal('line'), points: z.array(z.tuple([z.number(), z.number()])) }),
  Base.extend({ type: z.literal('arrow'), points: z.array(z.tuple([z.number(), z.number()])) }),
  Base.extend({
    type: z.literal('pen'),
    points: z.array(z.tuple([z.number(), z.number(), z.number()])),
  }),
  Base.extend({ type: z.literal('text'), text: z.string(), fontSize: z.number() }),
]);

export const SceneSchema = z.object({
  id: z.uuid(),
  elements: z.array(ElementSchema),
  updatedAt: z.number(),
});

export type Ink = z.infer<typeof InkSchema>;
export type StrokeWidth = (typeof STROKE_WIDTHS)[number];
export type BoardElement = z.infer<typeof ElementSchema>;
export type ElementType = BoardElement['type'];
export type Scene = z.infer<typeof SceneSchema>;
