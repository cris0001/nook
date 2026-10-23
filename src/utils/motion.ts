// True when the OS asks for reduced motion. Decorative animations (idle glances,
// blinking) check this and stay still; user-driven motion like cursor tracking stays.
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
