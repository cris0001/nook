import { forwardRef, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

// A quiet toolbar trigger that turns lime-tinted while its feature is in use (e.g. a
// filter is active), so a filtered view never looks like the full list.
export const ToolbarButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'> & { active?: boolean }
>(function ToolbarButton({ active = false, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex h-7 items-center gap-1.5 rounded-md px-2 text-[13px] transition-colors',
        active
          ? 'bg-primary-tint text-primary-tint-foreground font-medium'
          : 'text-muted-foreground hover:bg-hover hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
});
