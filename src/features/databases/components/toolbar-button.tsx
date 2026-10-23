import { forwardRef, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

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
