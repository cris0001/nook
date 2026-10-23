import { afterEach, describe, expect, it, vi } from 'vitest';

import { debounce } from './debounce';

afterEach(() => {
  vi.useRealTimers();
});

describe('debounce', () => {
  it('calls once with the latest arguments after the quiet period', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const save = debounce(fn, 100);
    save('a');
    save('b');
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledExactlyOnceWith('b');
  });

  it('flush runs a pending call immediately, and only once', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const save = debounce(fn, 100);
    save('x');
    save.flush();
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledExactlyOnceWith('x');
  });
});
