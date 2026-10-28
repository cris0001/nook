export function ChartTooltip({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <div
      role="status"
      className="bg-foreground text-background pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap shadow-md"
      style={{ left: x, top: y - 8 }}
    >
      {text}
    </div>
  );
}
