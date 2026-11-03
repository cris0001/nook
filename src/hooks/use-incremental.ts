import { useEffect, useState } from 'react';

// Renders a long list in pages: the first `step` items, then another `step` each time
// the sentinel element scrolls into view. Ten thousand table rows never hit the DOM at
// once, and nothing changes for lists shorter than one step.
export function useIncremental<T>(items: readonly T[], step: number) {
  const [limit, setLimit] = useState(step);
  const [sentinel, setSentinel] = useState<Element | null>(null);
  const hasMore = items.length > limit;

  useEffect(() => {
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setLimit((current) => current + step);
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, hasMore, step]);

  return {
    visible: hasMore ? items.slice(0, limit) : items,
    hidden: Math.max(0, items.length - limit),
    sentinel: setSentinel,
    showMore: () => setLimit((current) => current + step),
  };
}
