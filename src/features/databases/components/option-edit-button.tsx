import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { SelectOption } from '@/schemas/database.schema';

import { useDatabasesTranslation } from '../i18n';
import { OptionEditor } from './option-editor';

export function OptionEditButton({
  databaseId,
  propertyId,
  option,
  className,
}: {
  databaseId: string;
  propertyId: string;
  option: SelectOption;
  className?: string;
}) {
  const t = useDatabasesTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={t.editOption}
        title={t.editOption}
        className={cn(
          'text-muted-foreground hover:bg-hover hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-md',
          className,
        )}
      >
        <MoreHorizontal className="size-4" />
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="p-1.5">
        <OptionEditor
          databaseId={databaseId}
          propertyId={propertyId}
          option={option}
          onDone={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
