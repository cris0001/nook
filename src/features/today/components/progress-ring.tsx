export function ProgressRing({ ratio, label }: { ratio: number; label: string }) {
  const percent = Math.round(ratio * 100);
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 36 36" aria-hidden className="size-12 -rotate-90">
        <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="4" className="stroke-well" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${percent} 100`}
          className="stroke-primary"
        />
      </svg>
      <div>
        <p className="text-xl font-semibold tabular-nums">{percent}%</p>
        <p className="text-muted-foreground text-xs">{label}</p>
      </div>
    </div>
  );
}
