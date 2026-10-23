import { generateKeyBetween } from 'fractional-indexing';

import type { Page } from '@/schemas/page.schema';

import { byOrder } from '@/utils/order';

export type DropPosition = 'before' | 'after' | 'inside';

export interface DropPlan {
  parentId: string | null;
  order: string;
}

// True when `id` is `ancestorId` itself or sits anywhere under it.
function isWithin(pages: readonly Page[], id: string | null, ancestorId: string): boolean {
  const byId = new Map(pages.map((page) => [page.id, page]));
  for (let current = id; current; current = byId.get(current)?.parentId ?? null) {
    if (current === ancestorId) {
      return true;
    }
  }
  return false;
}

// Where a dragged page lands when dropped before / after / inside a target row: its
// new parent and a fractional key between the right neighbours. Returns null for
// drops that make no sense — onto itself, or into its own subtree (which would cut
// the branch off the tree).
export function planDrop(
  pages: readonly Page[],
  activeId: string,
  targetId: string,
  position: DropPosition,
): DropPlan | null {
  const target = pages.find((page) => page.id === targetId);
  if (!target || isWithin(pages, targetId, activeId)) {
    return null;
  }

  const siblingsOf = (parentId: string | null) =>
    pages.filter((page) => page.parentId === parentId && page.id !== activeId).sort(byOrder);

  if (position === 'inside') {
    const children = siblingsOf(target.id);
    return {
      parentId: target.id,
      order: generateKeyBetween(children.at(-1)?.order ?? null, null),
    };
  }

  const siblings = siblingsOf(target.parentId);
  const index = siblings.findIndex((page) => page.id === targetId);
  const [low, high] =
    position === 'before'
      ? [siblings[index - 1]?.order ?? null, target.order]
      : [target.order, siblings[index + 1]?.order ?? null];
  return { parentId: target.parentId, order: generateKeyBetween(low, high) };
}
