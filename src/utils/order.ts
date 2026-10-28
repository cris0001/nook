// Fractional-index keys compare by plain code points — not localeCompare, which
// would order them by locale rules and break the "between" guarantee.
// Two tabs can generate the same key for the same gap; the id breaks the tie so both
// tabs agree on the order.
export function byOrder<T extends { order: string; id: string }>(a: T, b: T): number {
  if (a.order !== b.order) return a.order < b.order ? -1 : 1;
  if (a.id !== b.id) return a.id < b.id ? -1 : 1;
  return 0;
}
