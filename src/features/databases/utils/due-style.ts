import type { DueTone } from '@/hooks/use-due-label';

export const DUE_CHIP =
  'inline-flex h-5 items-center rounded-[5px] px-1.5 font-mono text-[11px] whitespace-nowrap';

export const DUE_TONE: Record<DueTone, string> = {
  late: 'bg-(--tag-red-bg) text-(--tag-red-fg)',
  today: 'bg-primary-tint text-primary-tint-foreground',
  plain: 'bg-muted text-foreground/75',
};
