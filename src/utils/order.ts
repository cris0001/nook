// Fractional-index keys compare by plain code points — not localeCompare, which
// would order them by locale rules and break the "between" guarantee.
export function byOrder<T extends { order: string }>(a: T, b: T): number {
  if (a.order === b.order) {
    return 0;
  }
  return a.order < b.order ? -1 : 1;
}
