import { Check, Trash2 } from 'lucide-react';

import { deleteOption, updateOption } from '@/lib/data/databases';
import { cn } from '@/lib/utils';
import { OPTION_COLORS, type SelectOption } from '@/schemas/database.schema';
import { useConfirm } from '@/stores/confirm.store';

import { useDatabasesTranslation } from '../i18n';
import { OPTION_STYLE } from '../utils/option-style';

// Rename, recolor or delete one select option. Rendered inside whatever popover opened
// it (board column header, property header, select cell). Empty names aren't saved —
// an option needs a label to be pickable.
export function OptionEditor({
  databaseId,
  propertyId,
  option,
  onDone,
}: {
  databaseId: string;
  propertyId: string;
  option: SelectOption;
  onDone?: () => void;
}) {
  const t = useDatabasesTranslation();
  const confirm = useConfirm();

  async function onDelete() {
    onDone?.();
    const ok = await confirm({
      title: t.confirmDeleteOption(option.name),
      confirmText: t.deleteOption,
      destructive: true,
    });
    if (ok) {
      await deleteOption(databaseId, propertyId, option.id);
    }
  }

  return (
    <div className="w-52">
      <input
        autoFocus
        defaultValue={option.name}
        aria-label={t.optionName}
        onChange={(event) => {
          const name = event.target.value.trim();
          if (name) void updateOption(databaseId, propertyId, option.id, { name });
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onDone?.();
        }}
        className="mb-1 h-9 w-full rounded-md border bg-transparent px-2 text-sm outline-none"
      />
      <p className="text-muted-foreground px-1 pt-1 pb-0.5 text-xs">{t.color}</p>
      <ul>
        {OPTION_COLORS.map((color) => (
          <li key={color}>
            <button
              type="button"
              onClick={() => void updateOption(databaseId, propertyId, option.id, { color })}
              className="hover:bg-hover flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-sm"
            >
              <span className={cn('size-4 rounded', OPTION_STYLE[color])} />
              {t.colorName[color]}
              {option.color === color ? <Check className="ml-auto size-4" /> : null}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => void onDelete()}
        className="text-destructive hover:bg-hover mt-1 flex h-8 w-full items-center gap-2 rounded-md border-t px-1.5 pt-1 text-sm"
      >
        <Trash2 className="size-4" />
        {t.deleteOption}
      </button>
    </div>
  );
}
