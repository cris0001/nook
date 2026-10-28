import { describe, expect, it } from 'vitest';

import { normalizeUrl } from './safe-url';

describe('normalizeUrl', () => {
  it('adds https to bare domains', () => {
    expect(normalizeUrl('nook.app/docs')).toBe('https://nook.app/docs');
  });

  it('keeps http, https and mailto', () => {
    expect(normalizeUrl('http://a.com')).toBe('http://a.com/');
    expect(normalizeUrl('mailto:me@a.com')).toBe('mailto:me@a.com');
  });

  it('rejects other schemes and empty input', () => {
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeUrl('data:text/html,hi')).toBeNull();
    expect(normalizeUrl('   ')).toBeNull();
  });
});
