import { can, type Action } from '@/lib/permissions';
import { useRoleStore } from '@/stores/role.store';

export function useCan(action: Action): boolean {
  return useRoleStore((s) => can(s.role, action));
}

export function usePermissions(): (action: Action) => boolean {
  const role = useRoleStore((s) => s.role);
  return (action) => can(role, action);
}
