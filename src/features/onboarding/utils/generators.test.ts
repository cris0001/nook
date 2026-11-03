import { describe, expect, it } from 'vitest';

import { BackupSchema } from '@/schemas/backup.schema';

import { useDemoTranslation } from '../demo-copy';
import { buildDemoWorkspace } from './demo-workspace';
import { createRandom } from './random';
import { buildStressWorkspace } from './stress-workspace';
import { createWorkspaceBuilder } from './workspace-builder';

const NOW = new Date('2026-11-03T12:00:00').getTime();

function asBackup(rows: ReturnType<typeof createWorkspaceBuilder>['rows']) {
  return { format: 'nook', version: 1, exportedAt: NOW, ...rows };
}

describe('workspace generators', () => {
  it('builds a valid demo workspace with history for the charts', () => {
    const builder = createWorkspaceBuilder(null, NOW);
    buildDemoWorkspace(builder, useDemoTranslation.peek(), createRandom(42), NOW);
    expect(BackupSchema.safeParse(asBackup(builder.rows)).success).toBe(true);
    const records = builder.rows.pages.filter((p) => p.type === 'record');
    expect(records).toHaveLength(24 + 18);
    expect(records.filter((r) => r.doneAt).length).toBeGreaterThan(5);
    expect(builder.rows.views).toHaveLength(6);
    expect(builder.rows.dashboards).toHaveLength(1);
  });

  it('builds a valid stress workspace of the requested size, the same for the same seed', () => {
    const build = () => {
      const builder = createWorkspaceBuilder(null, NOW);
      buildStressWorkspace(builder, createRandom(7), NOW, {
        records: 500,
        documents: 20,
        shapes: 50,
      });
      return builder.rows;
    };
    const rows = build();
    expect(BackupSchema.safeParse(asBackup(rows)).success).toBe(true);
    expect(rows.pages.filter((p) => p.type === 'record')).toHaveLength(500);
    expect(rows.scenes[0]?.elements).toHaveLength(50);
    expect(build().pages.map((p) => p.title)).toEqual(rows.pages.map((p) => p.title));
  });

  it('keeps sibling order keys strictly increasing', () => {
    const builder = createWorkspaceBuilder('a5', NOW);
    buildStressWorkspace(builder, createRandom(1), NOW, { records: 300, documents: 10, shapes: 1 });
    const records = builder.rows.pages.filter((p) => p.type === 'record').map((p) => p.order);
    expect([...records].sort()).toEqual(records);
    expect((builder.rows.pages[0]?.order ?? '') > 'a5').toBe(true);
  });
});
