import { Check, ChevronDown, UserRound } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCommonTranslation } from '@/lib/i18n/common';
import { ROLES } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { useRoleStore } from '@/stores/role.store';

export function RoleSwitcher({ className }: { className?: string }) {
  const t = useCommonTranslation();
  const role = useRoleStore((s) => s.role);
  const setRole = useRoleStore((s) => s.setRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.role.label}
        title={t.role.label}
        className={cn(
          'hover:bg-hover data-[state=open]:bg-hover flex h-9 items-center gap-1.5 rounded-sm px-2 text-xs font-medium',
          className,
        )}
      >
        <UserRound className="size-3.5" />
        {t.role.names[role]}
        <ChevronDown className="text-muted-foreground size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-64">
        <p className="text-muted-foreground px-2 py-1.5 text-xs">{t.role.hint}</p>
        <DropdownMenuSeparator />
        {ROLES.map((code) => (
          <DropdownMenuItem key={code} onSelect={() => setRole(code)} className="items-start">
            <span className="flex-1">
              <span className="block">{t.role.names[code]}</span>
              <span className="text-muted-foreground block text-xs">
                {t.role.descriptions[code]}
              </span>
            </span>
            {code === role ? <Check className="mt-0.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
