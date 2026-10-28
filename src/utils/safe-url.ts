const ALLOWED = ['http:', 'https:', 'mailto:'];

// Bare "example.com" becomes https; anything with another scheme (javascript:, data:)
// is rejected rather than turned into a clickable link.
export function normalizeUrl(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(candidate);
    return ALLOWED.includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
