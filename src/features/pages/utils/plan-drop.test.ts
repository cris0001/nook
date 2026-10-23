import { describe, expect, it } from 'vitest';

import { makePage } from '@/test/make-page';

import { planDrop } from './plan-drop';

// a ─ a1
//   └ a2
// b
// c
const PAGES = [
  makePage('a', null, { order: 'a0' }),
  makePage('a1', 'a', { order: 'a0' }),
  makePage('a2', 'a', { order: 'a1' }),
  makePage('b', null, { order: 'a1' }),
  makePage('c', null, { order: 'a2' }),
];

describe('planDrop', () => {
  it('drops before a target, between it and its previous sibling', () => {
    const plan = planDrop(PAGES, 'c', 'b', 'before');
    expect(plan?.parentId).toBeNull();
    expect(plan && 'a0' < plan.order && plan.order < 'a1').toBe(true);
  });

  it('drops after the last sibling with an open upper bound', () => {
    const plan = planDrop(PAGES, 'a', 'c', 'after');
    expect(plan && plan.order > 'a2').toBe(true);
  });

  it('ignores the dragged page itself when finding neighbours', () => {
    // Moving b right after a: b's own old slot must not be used as the upper bound.
    const plan = planDrop(PAGES, 'b', 'a', 'after');
    expect(plan && 'a0' < plan.order && plan.order < 'a2').toBe(true);
  });

  it('drops inside a target as its last child', () => {
    const plan = planDrop(PAGES, 'c', 'a', 'inside');
    expect(plan?.parentId).toBe('a');
    expect(plan && plan.order > 'a1').toBe(true);
  });

  it('moves a nested page out to another level', () => {
    expect(planDrop(PAGES, 'a1', 'c', 'after')?.parentId).toBeNull();
  });

  it('refuses drops onto itself or into its own subtree', () => {
    expect(planDrop(PAGES, 'a', 'a', 'inside')).toBeNull();
    expect(planDrop(PAGES, 'a', 'a2', 'after')).toBeNull();
    expect(planDrop(PAGES, 'a', 'a1', 'inside')).toBeNull();
  });
});
