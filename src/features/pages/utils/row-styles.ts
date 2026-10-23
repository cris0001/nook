const LIME_BAR =
  'before:absolute before:top-2 before:bottom-2 before:-left-1.5 before:w-[2.5px] before:rounded-full before:bg-primary before:opacity-0';

export const SIDEBAR_ROW =
  'relative flex h-10 min-w-0 items-center rounded-[7px] text-sm text-muted-foreground hover:bg-hover lg:h-[30px]';

export const ACTIVE_SELF = `${LIME_BAR} data-[status=active]:bg-background data-[status=active]:font-medium data-[status=active]:text-foreground data-[status=active]:shadow-raised data-[status=active]:before:opacity-100`;

export const ACTIVE_WITHIN = `${LIME_BAR} has-[[data-status=active]]:bg-background has-[[data-status=active]]:shadow-raised has-[[data-status=active]]:before:opacity-100`;

export const SECTION_LABEL = 'px-2 pt-5 pb-1.5 text-[11.5px] font-medium text-muted-foreground';
