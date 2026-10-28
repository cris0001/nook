import type { SelectOption } from '@/schemas/database.schema';

export function StatusBars({
  stages,
  total,
}: {
  stages: { option: SelectOption; count: number }[];
  total: number;
}) {
  const max = Math.max(1, ...stages.map((s) => s.count));
  return (
    <ul className="flex flex-col gap-2.5">
      {stages.map(({ option, count }) => (
        <li key={option.id} className="grid grid-cols-[8rem_1fr_3.5rem] items-center gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <i
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ background: `var(--dot-${option.color})` }}
            />
            <span className="truncate">{option.name}</span>
          </span>
          <span className="bg-well h-2.5 overflow-hidden rounded-full">
            <span
              className="block h-full rounded-full transition-[width] duration-500"
              style={{ width: `${(count / max) * 100}%`, background: `var(--dot-${option.color})` }}
            />
          </span>
          <span className="text-muted-foreground text-right font-mono text-xs tabular-nums">
            {count}
            <span> · {total ? Math.round((count / total) * 100) : 0}%</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
