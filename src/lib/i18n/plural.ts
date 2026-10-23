// Polish has three forms: 1 zadanie, 2–4 zadania, 5+ (and 12–14) zadań.
export function polishPlural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const tens = n % 100;
  const ones = n % 10;
  return ones >= 2 && ones <= 4 && (tens < 12 || tens > 14) ? few : many;
}
