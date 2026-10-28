import { describe, expect, it } from 'vitest';

import { textStats } from './text-stats';

const doc = (...texts: string[]) => ({
  type: 'doc',
  content: texts.map((text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })),
});

describe('textStats', () => {
  it('counts words across blocks without gluing them together', () => {
    expect(textStats(doc('Hello world', 'second block')).words).toBe(4);
  });

  it('counts Polish words and hyphenated words once', () => {
    expect(textStats(doc('Zażółć gęślą jaźń — e-mail')).words).toBe(4);
  });

  it('rounds reading time, at least one minute for any text', () => {
    expect(textStats(doc('one')).minutes).toBe(1);
    expect(textStats(doc(Array(660).fill('word').join(' '))).minutes).toBe(3);
    expect(textStats(null)).toEqual({ words: 0, minutes: 0 });
  });
});
