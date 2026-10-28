import { describe, expect, it } from 'vitest';

import { byOrder } from './order';

describe('byOrder', () => {
  it('sorts by key, then by id when two keys collide', () => {
    const items = [
      { id: 'b', order: 'a1' },
      { id: 'c', order: 'a0' },
      { id: 'a', order: 'a1' },
    ];
    expect(items.sort(byOrder).map((i) => i.id)).toEqual(['c', 'a', 'b']);
  });
});
