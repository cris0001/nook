import type { Locale } from '@/stores/locale.store';

// Small inline SVG flags. Emoji flags don't render on Windows (they show as letters), so
// these are drawn by hand: a simplified Union Jack and the Polish bicolour, 3:2.
function GbFlag() {
  return (
    <svg viewBox="0 0 60 40" aria-hidden className="block size-full">
      <clipPath id="gb-flag-clip">
        <rect width="60" height="40" />
      </clipPath>
      <g clipPath="url(#gb-flag-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" strokeWidth="3" />
        <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
        <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  );
}

function PlFlag() {
  return (
    <svg viewBox="0 0 60 40" aria-hidden className="block size-full">
      <rect width="60" height="20" fill="#fff" />
      <rect y="20" width="60" height="20" fill="#DC143C" />
    </svg>
  );
}

const FLAGS: Record<Locale, () => React.JSX.Element> = { en: GbFlag, pl: PlFlag };

// A flag in a 3:2 frame with a hairline edge, so the white of the Polish flag doesn't
// melt into a white background.
export function Flag({ locale, className }: { locale: Locale; className?: string }) {
  const Svg = FLAGS[locale];
  return (
    <span
      className={`inline-block h-3 w-[18px] shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgb(0_0_0/0.12)] ${className ?? ''}`}
    >
      <Svg />
    </span>
  );
}
