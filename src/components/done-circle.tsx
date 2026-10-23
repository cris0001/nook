import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export function DoneCircle({
  done,
  label,
  disabled = false,
  onToggle,
  className,
}: {
  done: boolean;
  label: string;
  disabled?: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onToggle}
      onPointerDown={(event) => event.stopPropagation()}
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-[background-color,border-color,box-shadow] duration-150 disabled:opacity-40',
        done
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-muted-foreground/60 hover:border-primary hover:ring-primary-tint enabled:hover:ring-4',
        className,
      )}
    >
      {done ? <Check className="size-2.5 animate-[pop_160ms_ease-out] stroke-[4]" /> : null}
    </button>
  );
}
