import { insertRows, lastRootOrder } from '@/lib/data/bulk';

import type { DemoCopy } from '../demo-copy';
import { buildDemoWorkspace } from '../utils/demo-workspace';
import { createRandom } from '../utils/random';
import { buildStressWorkspace, STRESS_SIZE, type StressSize } from '../utils/stress-workspace';
import { createWorkspaceBuilder } from '../utils/workspace-builder';

export async function addDemoWorkspace(copy: DemoCopy): Promise<void> {
  const now = Date.now();
  const builder = createWorkspaceBuilder(await lastRootOrder(), now);
  buildDemoWorkspace(builder, copy, createRandom(42), now);
  await insertRows(builder.rows);
}

export async function addStressWorkspace(size: StressSize = STRESS_SIZE): Promise<number> {
  const now = Date.now();
  const builder = createWorkspaceBuilder(await lastRootOrder(), now);
  buildStressWorkspace(builder, createRandom(7), now, size);
  await insertRows(builder.rows);
  return builder.rows.pages.length;
}
