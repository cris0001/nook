import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom lacks the layout APIs Radix and our hooks touch; inert stand-ins are enough
// for behaviour tests.
const noop = () => undefined;
globalThis.ResizeObserver ??= class {
  observe = noop;
  unobserve = noop;
  disconnect = noop;
} as unknown as typeof ResizeObserver;
const fakeMatchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: noop,
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
Object.defineProperty(window, 'matchMedia', { configurable: true, value: fakeMatchMedia });
if (!('scrollIntoView' in Element.prototype))
  Object.assign(Element.prototype, { scrollIntoView: noop });
if (!('hasPointerCapture' in Element.prototype)) {
  Object.assign(Element.prototype, { hasPointerCapture: () => false });
}

afterEach(() => cleanup());
