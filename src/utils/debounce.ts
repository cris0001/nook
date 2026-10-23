export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: A | null = null;

  const run = () => {
    clearTimeout(timer);
    if (pending) {
      const args = pending;
      pending = null;
      fn(...args);
    }
  };

  const debounced = (...args: A) => {
    pending = args;
    clearTimeout(timer);
    timer = setTimeout(run, ms);
  };
  debounced.flush = run;
  return debounced;
}
