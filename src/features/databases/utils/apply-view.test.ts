import { describe, expect, it } from 'vitest';

import type { Database, Filter } from '@/schemas/database.schema';
import { makePage } from '@/test/make-page';

import { filterRecords, sortRecords, TITLE_ID } from './apply-view';

const DB: Database = {
  id: '00000000-0000-4000-8000-000000000000',
  properties: [
    {
      id: 'status',
      name: 'Status',
      type: 'select',
      options: [
        { id: 'todo', name: 'To do', color: 'gray' },
        { id: 'doing', name: 'In progress', color: 'blue' },
        { id: 'done', name: 'Done', color: 'green' },
      ],
    },
    { id: 'points', name: 'Points', type: 'number', options: [] },
    { id: 'done?', name: 'Done?', type: 'checkbox', options: [] },
    { id: 'tags', name: 'Tags', type: 'multiSelect', options: [] },
  ],
};

const records = [
  makePage('Write docs', 'db', { properties: { status: 'done', points: 3, tags: ['a'] } }),
  makePage('Fix bug 10', 'db', { properties: { status: 'todo', points: 8, 'done?': true } }),
  makePage('Fix bug 9', 'db', { properties: { status: 'doing' } }),
  makePage('Plan', 'db', { properties: { tags: ['a', 'b'] } }),
];

const titles = (pages: typeof records) => pages.map((p) => p.title);
const filter = (f: Omit<Filter, 'id'>): Filter => ({ id: 'f', ...f });

describe('filterRecords', () => {
  it('matches text with contains, case-insensitively', () => {
    const result = filterRecords(
      records,
      [filter({ propertyId: TITLE_ID, operator: 'contains', value: 'BUG' })],
      DB,
    );
    expect(titles(result)).toEqual(['Fix bug 10', 'Fix bug 9']);
  });

  it('combines filters with AND', () => {
    const result = filterRecords(
      records,
      [
        filter({ propertyId: TITLE_ID, operator: 'contains', value: 'bug' }),
        filter({ propertyId: 'status', operator: 'isNot', value: 'todo' }),
      ],
      DB,
    );
    expect(titles(result)).toEqual(['Fix bug 9']);
  });

  it('handles empty checks, multi-select contains and checkboxes', () => {
    expect(
      titles(
        filterRecords(
          records,
          [filter({ propertyId: 'status', operator: 'isEmpty', value: null })],
          DB,
        ),
      ),
    ).toEqual(['Plan']);
    expect(
      titles(
        filterRecords(
          records,
          [filter({ propertyId: 'tags', operator: 'contains', value: 'b' })],
          DB,
        ),
      ),
    ).toEqual(['Plan']);
    expect(
      titles(
        filterRecords(records, [filter({ propertyId: 'done?', operator: 'is', value: true })], DB),
      ),
    ).toEqual(['Fix bug 10']);
  });

  it('ignores filters still waiting for a value', () => {
    const result = filterRecords(
      records,
      [filter({ propertyId: 'status', operator: 'is', value: null })],
      DB,
    );
    expect(result).toHaveLength(4);
  });
});

describe('sortRecords', () => {
  it('sorts titles naturally (bug 9 before bug 10)', () => {
    const result = sortRecords(records, [{ propertyId: TITLE_ID, direction: 'asc' }], DB);
    expect(titles(result)).toEqual(['Fix bug 9', 'Fix bug 10', 'Plan', 'Write docs']);
  });

  it('sorts selects by option order and puts empty values last in both directions', () => {
    const asc = sortRecords(records, [{ propertyId: 'status', direction: 'asc' }], DB);
    const desc = sortRecords(records, [{ propertyId: 'status', direction: 'desc' }], DB);
    expect(titles(asc)).toEqual(['Fix bug 10', 'Fix bug 9', 'Write docs', 'Plan']);
    expect(titles(desc)).toEqual(['Write docs', 'Fix bug 9', 'Fix bug 10', 'Plan']);
  });

  it('sorts numbers numerically', () => {
    const result = sortRecords(records, [{ propertyId: 'points', direction: 'desc' }], DB);
    expect(titles(result).slice(0, 2)).toEqual(['Fix bug 10', 'Write docs']);
  });
});
