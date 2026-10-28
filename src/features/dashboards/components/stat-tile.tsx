import { cn } from '@/lib/utils';

export function StatTile({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: number;
  alert?: boolean;
}) {
  return (
    <div className="border-divider rounded-lg border px-4 py-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={cn('mt-1 text-2xl font-semibold', alert && value > 0 && 'text-destructive')}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
