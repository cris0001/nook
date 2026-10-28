import { db } from '@/lib/db';
import type { BoardElement } from '@/schemas/scene.schema';

export async function getScene(pageId: string): Promise<BoardElement[]> {
  return (await db.scenes.get(pageId))?.elements ?? [];
}

export async function saveScene(pageId: string, elements: BoardElement[]): Promise<void> {
  await db.scenes.put({ id: pageId, elements, updatedAt: Date.now() });
}
