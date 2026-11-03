// @vitest-environment jsdom
import '@/test/setup-dom';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useIncremental } from './use-incremental';

const items = Array.from({ length: 250 }, (_, i) => i);

describe('useIncremental', () => {
  it('shows one step at a time and counts the rest', () => {
    const { result } = renderHook(() => useIncremental(items, 100));
    expect(result.current.visible).toHaveLength(100);
    expect(result.current.hidden).toBe(150);

    act(() => result.current.showMore());
    act(() => result.current.showMore());
    expect(result.current.visible).toHaveLength(250);
    expect(result.current.hidden).toBe(0);
  });

  it('leaves short lists alone', () => {
    const { result } = renderHook(() => useIncremental(items.slice(0, 10), 100));
    expect(result.current.visible).toHaveLength(10);
    expect(result.current.hidden).toBe(0);
  });
});
