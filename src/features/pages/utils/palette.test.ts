import { describe, expect, it } from 'vitest';

import { makePage } from '@/test/make-page';

import { matchScore, paletteEntries } from './palette';

describe('matchScore', () => {
  it('ranks title prefixes above word and substring matches', () => {
    expect(matchScore(['Sprint board'], 'spr')).toBe(1);
    expect(matchScore(['Sprint board'], 'boa')).toBe(0.8);
    expect(matchScore(['Sprint board'], 'oar')).toBe(0.6);
    expect(matchScore(['Fix login', 'Sprint board'], 'sprint')).toBe(0.3);
    expect(matchScore(['Fix login'], 'xyz')).toBe(0);
  });

  it('ignores case and Polish diacritics', () => {
    expect(matchScore(['Zadania na środę'], 'srod')).toBe(0.8);
  });
});

describe('paletteEntries', () => {
  it('describes where each page lives', () => {
    const pages = [makePage('Work', null), makePage('Board', 'Work'), makePage('Task', 'Board')];
    expect(paletteEntries(pages, 'Untitled').map((e) => e.path)).toEqual([
      '',
      'Work',
      'Work / Board',
    ]);
  });
});
