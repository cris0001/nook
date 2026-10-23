import { cn } from '@/lib/utils';
import type { SelectOption } from '@/schemas/database.schema';

import { OPTION_STYLE } from '../utils/option-style';

// A select option rendered as a small colored tag.
export function OptionTag({ option, className }: { option: SelectOption; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 max-w-full items-center truncate rounded-sm px-1.5 text-xs font-medium',
        OPTION_STYLE[option.color],
        className,
      )}
    >
      {option.name}
    </span>
  );
}
