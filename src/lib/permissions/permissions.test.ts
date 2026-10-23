import { describe, expect, it } from 'vitest';

import { can } from './permissions';

describe('can', () => {
  it('lets the owner do everything', () => {
    expect(can('owner', 'page.deleteForever')).toBe(true);
    expect(can('owner', 'database.editSchema')).toBe(true);
  });

  it('lets an editor work on content but not on structure', () => {
    expect(can('editor', 'record.edit')).toBe(true);
    expect(can('editor', 'database.editSchema')).toBe(false);
    expect(can('editor', 'page.deleteForever')).toBe(false);
  });

  it('keeps a viewer read-only', () => {
    expect(can('viewer', 'page.edit')).toBe(false);
    expect(can('viewer', 'page.create')).toBe(false);
  });
});
