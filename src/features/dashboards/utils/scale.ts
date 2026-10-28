const TICK_COUNT = 4;

// Axis maximum = 4 clean steps (1, 2, 3 or 5 × 10^n), so every tick is a whole number.
export function niceMax(value: number): number {
  const raw = Math.max(value, TICK_COUNT) / TICK_COUNT;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = ([1, 2, 3, 5, 10].find((m) => m * power >= raw) ?? 10) * power;
  return step * TICK_COUNT;
}

export function ticks(max: number): number[] {
  return Array.from({ length: TICK_COUNT + 1 }, (_, i) => (max / TICK_COUNT) * i);
}
